#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use crate::auction::{AuctionContract, AuctionParams};
use stylus_sdk::{
    alloy_primitives::{Address},
    prelude::*
};

#[cfg(target_arch = "wasm32")]

mod auction;
/// Configures the Auction data.
struct UranusParams;

impl AuctionParams for UranusParams {
    const OWNER = Address::0x71c66b00f5799026db8a4873c761bd7643828e5e;
}

// The contract
sol_storage! {
    #[entrypoint]
    struct Uranus {
        #[borrow] // Allows aution to access Auction's storage and make calls
        AuctionContract<UranusParams> auction;
    }
}

impl Uranus {}