module vault::credit_token {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::balance::{Balance};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::option;

    struct CREDIT_TOKEN has drop {}
    
    fun init(otw: CREDIT_TOKEN, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency<CREDIT_TOKEN>(
            otw,
            9,
            b"CRDT",
            b"Vault Credit Token",
            b"Token for paying for credit in the vault",
            option::none(),
            ctx
        );
        // Transfer the TreasuryCap to the publisher of the module
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
        // Share the metadata object so it's accessible to everyone
        transfer::public_share_object(metadata);
    }

    // === Public Functions ===

    /// Mint new `CreditToken` coins. Only the owner of `TreasuryCap<CreditToken>` can call this.
    public entry fun mint(
        treasury_cap: &mut TreasuryCap<CREDIT_TOKEN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }

    /// Burn `CreditToken` coins. Only the owner of `TreasuryCap<CreditToken>` can call this.
    public entry fun burn(treasury_cap: &mut TreasuryCap<CREDIT_TOKEN>, coin: Coin<CREDIT_TOKEN>) {
        coin::burn(treasury_cap, coin);
    }

    /// Get the total supply of `CreditToken`.
    public fun total_supply(treasury_cap: &TreasuryCap<CREDIT_TOKEN>): u64 {
        coin::total_supply(treasury_cap)
    }

    /// Get the balance of a `CreditToken` coin object.
    public fun balance(coin: &Coin<CREDIT_TOKEN>): &Balance<CREDIT_TOKEN> {
        coin::balance(coin)
    }

    /// Get the value (amount) of a `CreditToken` coin object.
    public fun value(coin: &Coin<CREDIT_TOKEN>): u64 {
        coin::value(coin)
    }
}