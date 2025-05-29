module vault::vault {
    use sui::coin::{Self, Coin};
    use sui::transfer::{public_transfer, share_object};
    use sui::tx_context::{TxContext, sender, epoch_timestamp_ms};
    use sui::object::{Self, UID};
    use sui::table::{Self, Table};
    use sui::balance::{Self, Balance};
    use sui::event;
    use vault::credit_token::{CREDIT_TOKEN};

    #[test_only]
    use std::vector;
    #[test_only]
    use sui::test_scenario;
    #[test_only]
    use sui::test_utils::{assert_eq, destroy};


    // --- Constants ---

    const E_INSUFFICIENT_CREDIT: u64 = 1;
    const E_ZERO_AMOUNT: u64 = 2;
    const E_INVALID_RATE: u64 = 3;
    const E_NOT_GUESS_DEFAULT: u64 = 4;
    const E_INVALID_LUCKY_NUMBER_RANGE: u64 = 5;
    const E_INSUFFICIENT_PAYMENT: u64 = 6;
    const E_ZERO_CREDITS_PURCHASED: u64 = 7;


    // --- Event Structs ---

    struct CreditPurchased has copy, drop {
        user: address,
        credits_bought: u64,
        tokens_paid: u64,
        timestamp_ms: u64,
    }

    struct GuessMade has copy, drop {
        user: address,
        guessed_number: u64,
        is_correct: bool,
        timestamp_ms: u64,
    }

    struct GameSetup has copy, drop {
        lucky_number: u64,
        timestamp_ms: u64,
    }

    struct RateSet has copy, drop {
        new_rate: u64,
        timestamp_ms: u64,
    }


    // --- Struct ---

    /// Capability that grants administrative rights over the vault.
    struct VaultAdminCap has key, store {
        id: UID,
    }

    /// Represents the vault's state.
    struct Vault has key {
        id: UID,
        /// The lucky number for the current game.
        lucky_number: u64,
        /// Table storing user addresses to their credit balance.
        /// key: address, value: u64 (credit)
        user_credits: Table<address, u64>,
        /// Exchange rate: number of T tokens per credit.
        exchange_rate: u64,
        /// Balance of the token T stored in the vault
        token_balance: Balance<CREDIT_TOKEN>,
    }

    // --- Errors ---

    /// One-time witness for the module used in init.
    struct VAULT has drop {}

    /// Initializes the vault
    fun init(_otw: VAULT, ctx: &mut TxContext) {
        // Create and transfer VaultAdminCap to the publisher
        public_transfer(VaultAdminCap { id: object::new(ctx) }, sender(ctx));

        // Create the Vault object
        let vault = Vault {
            id: object::new(ctx),
            lucky_number: 0, // Default lucky number, admin should set it
            user_credits: table::new(ctx),
            exchange_rate: 1_000_000_000, // Default rate: 1 CRDT for 1 credit
            token_balance: balance::zero<CREDIT_TOKEN>(),
        };

        share_object(vault);
    }

    // --- Public Entry Functions ---

    /// Allows a user to buy credits by depositing token T.
    public entry fun buy_credit(vault: &mut Vault, payment: Coin<CREDIT_TOKEN>, credits_to_purchase: u64, ctx: &mut TxContext) {
        assert!(credits_to_purchase > 0, E_ZERO_CREDITS_PURCHASED);
        assert!(coin::value(&payment) > 0, E_ZERO_AMOUNT);

        let required_tokens = credits_to_purchase * vault.exchange_rate;
        let payment_value = coin::value(&payment);
        assert!(payment_value >= required_tokens, E_INSUFFICIENT_PAYMENT);

        let user_address = sender(ctx);
        if (table::contains(&vault.user_credits, user_address)) {
            let current_credit_ref = table::borrow_mut(&mut vault.user_credits, user_address);
            *current_credit_ref = *current_credit_ref + credits_to_purchase;
        } else {
            table::add(&mut vault.user_credits, user_address, credits_to_purchase);
        };
        
        // Emit event
        event::emit(CreditPurchased {
            user: user_address,
            credits_bought: credits_to_purchase,
            tokens_paid: required_tokens, // Log the actual tokens used for the credits
            timestamp_ms: epoch_timestamp_ms(ctx),
        });

        // Handle payment and change
        if (payment_value > required_tokens) {
            let change_amount = payment_value - required_tokens;
            let change_coin = coin::split(&mut payment, change_amount, ctx);
            public_transfer(change_coin, user_address);
        };
        // The remaining `payment` coin now has `required_tokens` value
        let coin_balance = coin::into_balance(payment);
        balance::join(&mut vault.token_balance, coin_balance);
    }

    /// Allows a user to guess the lucky number.
    /// Deducts 1 credit from the user.
    /// Returns true if the guess is correct, false otherwise.
    public entry fun guess(vault: &mut Vault, guessed_number: u64, ctx: &mut TxContext): bool {
        let user_address = sender(ctx);
        let current_credit_ref = table::borrow_mut(&mut vault.user_credits, user_address);

        assert!(*current_credit_ref > 0, E_INSUFFICIENT_CREDIT);
        assert!(guessed_number > 0, E_NOT_GUESS_DEFAULT);

        *current_credit_ref = *current_credit_ref - 1;

        let is_correct = if (guessed_number == vault.lucky_number) {
            // Optionally, add logic here for when a user guesses correctly (e.g., reward distribution)
            true
        } else {
            false
        };

        // Emit event
        event::emit(GuessMade {
            user: user_address,
            guessed_number: guessed_number,
            is_correct: is_correct,
            timestamp_ms: epoch_timestamp_ms(ctx),
        });

        is_correct
    }

    /// Allows the admin to set up the game by providing a new lucky number.
    public entry fun setup_game(_: &VaultAdminCap, vault: &mut Vault, new_lucky_number: u64, ctx: &mut TxContext) {
        assert!(new_lucky_number >= 1 && new_lucky_number <= 999, E_INVALID_LUCKY_NUMBER_RANGE);
        vault.lucky_number = new_lucky_number;

        // Emit event
        event::emit(GameSetup {
            lucky_number: new_lucky_number,
            timestamp_ms: epoch_timestamp_ms(ctx),
        });
    }

    /// Allows the admin to set the exchange rate (tokens per credit).
    public entry fun set_rate(_: &VaultAdminCap, vault: &mut Vault, new_rate: u64, ctx: &mut TxContext) {
        assert!(new_rate > 0, E_INVALID_RATE);
        vault.exchange_rate = new_rate;

        // Emit event
        event::emit(RateSet {
            new_rate: new_rate,
            timestamp_ms: epoch_timestamp_ms(ctx),
        });
    }


    // --- Read-Only Functions ---

    /// Fetches the credit balance for a given user address.
    public fun fetch_credit(vault: &Vault, user_address: address): u64 {
        if (table::contains(&vault.user_credits, user_address)) {
            *table::borrow(&vault.user_credits, user_address)
        } else {
            0
        }
    }

    /// Gets the current exchange rate (tokens per credit).
    public fun get_rate(vault: &Vault): u64 {
        vault.exchange_rate
    }

    // === Tests ===
    #[test]
    fun test_init_success_resources_created() {
        let module_owner = @0xa;
        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;

        {
            init(VAULT {},test_scenario::ctx(scenario));
        };
        let tx = test_scenario::next_tx(scenario, module_owner);
        let expected_created_objects = 2;
        let expected_shared_objects = 1;
        assert_eq(
            vector::length(&test_scenario::created(&tx)),
            expected_created_objects
        );
        assert_eq(
            vector::length(&test_scenario::shared(&tx)),
            expected_shared_objects
        );

        {
            let state = test_scenario::take_shared<Vault>(scenario);

            assert_eq(state.lucky_number, 0);

            assert_eq(table::length(&state.user_credits), 0);

            assert_eq(state.exchange_rate, 1_000_000_000);

            assert_eq(balance::value(&state.token_balance), 0);

            test_scenario::return_shared(state);
        };
        test_scenario::end(scenario_val);
    }
    #[test]
    fun test_init_and_buy_credit_success() {
        let module_owner = @0xa;
        let user_1_addr = @0xb;
        let scenario_val = test_scenario::begin(module_owner);
        let scenario = &mut scenario_val;
    
        {
            init(VAULT {},test_scenario::ctx(scenario));
        };

        // User 1 buys 10 credits
        test_scenario::next_tx(scenario, user_1_addr);
        {
            let vault = test_scenario::take_shared<Vault>(scenario);
            let payment_coin = coin::mint_for_testing<CREDIT_TOKEN>(10_000_000_000, test_scenario::ctx(scenario)); // 10 CRDT
            buy_credit(&mut vault, payment_coin, 10, test_scenario::ctx(scenario));
            test_scenario::return_shared(vault);
        };

        // Check user 1 credit and vault balance
        {
            let vault = test_scenario::take_shared<Vault>(scenario);
            assert!(fetch_credit(&vault, user_1_addr) == 10, 0);
            assert!(balance::value(&vault.token_balance) == 10_000_000_000, 1);
            test_scenario::return_shared(vault);
        };

        test_scenario::end(scenario_val);
    }



}




