/// Use an efficient WASM allocator.
#[global_allocator]
static ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;

use core::marker::PhantomData;
use alloc::{string::String, vec::Vec};
/// Import items from the SDK. The prelude contains common traits and macros.
use stylus_sdk::{
    alloy_primitives::{Address},
    alloy_sol_types::sol,
    prelude::*
};

sol! {
    error NotOwner();
}

pub trait AuctionParams {
    const OWNER: Address;
}

// Define some persistent storage using the Solidity ABI.
// `AuctionContract` will be the entrypoint.
sol_storage! {
    pub struct AuctionContract<T> {
        mapping(string => Auction) actions;
        /// Used to allow [`AuctionParams`]
        PhantomData<T> phantom;
    }

    pub struct Auction {
        address bidder;
        uint256 bid_amount;
        uint256 start_time;
        uint256 end_time;
    }
}

pub enum AuctionError {
    NotOwner,
}

impl From<AuctionError> for Vec<u8> {
    fn from(err: AuctionError) -> Vec<u8> {
        match err {
            AuctionError::NotOwner => b"caller is not owner".to_vec(),
        }
    }
}

impl<T: AuctionParams> AuctionContract<T> {}

#[external]
impl<T: AuctionParams> AuctionContract<T> {
    /// Gets the number from storage.
    pub fn owner(&self) -> Result<Address, AuctionError> {
        Ok(T::OWNER)
    }
}
