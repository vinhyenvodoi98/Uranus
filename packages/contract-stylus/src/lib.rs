#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

#[global_allocator]
static ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;

use crate::auction::{AuctionContract, AuctionParams};
use stylus_sdk::{
    alloy_primitives::{Address},
    prelude::*
};

mod auction;
/// Configures the Auction data.
struct UranusParams;

impl AuctionParams for UranusParams {
    const OWNER: &'static str = "0x66f9664f97F2b50F62D13eA064982f936dE76657";
}

// The contract
sol_storage! {
    #[entrypoint]
    struct Uranus {
        address asset;
        #[borrow] // Allows aution to access Auction's storage and make calls
        AuctionContract<UranusParams> auction;
    }
}

#[external]
#[inherit(AuctionContract<UranusParams>)]
impl Uranus {
    pub fn set_asset(&mut self, _asset: Address) -> Result<Address, Vec<u8>> {
        self.asset.set(_asset);
        Ok(_asset)
    }
}