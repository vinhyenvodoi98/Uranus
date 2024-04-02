/// Use an efficient WASM allocator
use core::marker::PhantomData;
// use alloc::{string::String, vec::Vec};
/// Import items from the SDK. The prelude contains common traits and macros.
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    msg,
    contract,
    call::RawCall,
    function_selector,
    alloy_sol_types::sol,
    prelude::*
};

sol! {
    error NotOwner();
}

pub trait AuctionParams {
    const OWNER: &'static str;
}

// Define some persistent storage using the Solidity ABI.
// `AuctionContract` will be the entrypoint.
sol_storage! {
    pub struct AuctionContract<T> {
        mapping(string => Auction) auctions;
        /// Used to allow [`AuctionParams`]
        PhantomData<T> phantom;
    }

    pub struct Auction {
        address bidder;
        address owner;
        uint256 start_price;
        uint256 current_price;
        uint256 expected_price;
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
    pub fn owner(&self) -> Result<String, Vec<u8>> {
        Ok(T::OWNER.into())
    }

    pub fn start_auction(
        &mut self,
        contract: Address,
        token_id: U256,
        current_price: U256,
        expected_price: U256,
        start_time:U256,
        end_time: U256
    ) {
        // verify owner
        // let selector = function_selector!("ownerOf(uint256)");
        // let data = [
        //     &selector[..],
        //     &token_id.to_be_bytes::<32>(),
        // ].concat();
        // let nft_owner = RawCall::new().call(contract, &data);

        // if String::from_utf8_lossy(&nft_owner).into_owned(); != msg::sender().to_string() {
        //     return Err(e) => println!("not owner"),;
        // }

        // start price > 0
        let selector = function_selector!("transferFrom(address,address,uint256)");
        let data = [
            &selector[..],
            &msg::sender().into_array(),
            &contract::address().into_array(),
            &token_id.to_be_bytes::<32>(),
        ].concat();
        let _ = RawCall::new().call(contract, &data);

        let id = contract.to_string() + &token_id.to_string();

        self.auctions.setter(id.clone()).owner.set(msg::sender());
        self.auctions.setter(id.clone()).current_price.set(current_price);
        self.auctions.setter(id.clone()).expected_price.set(expected_price);
        self.auctions.setter(id.clone()).start_time.set(start_time);
        self.auctions.setter(id.clone()).end_time.set(end_time);
    }

    #[payable]
    pub fn place_bid(
        &mut self,
        contract: Address,
        token_id: U256
    ) {
        // check if auction end
        // value must higher than current_price
        let id = contract.to_string() + &token_id.to_string();

        self.auctions.setter(id.clone()).bidder.set(msg::sender());
        self.auctions.setter(id.clone()).current_price.set(msg::value());
    }

    pub fn end_auction(
        &mut self,
        contract: Address,
        token_id: U256
    ) {
        let id = contract.to_string() + &token_id.to_string();
        // check if auction end
        let selector = function_selector!("transferFrom(address,address,uint256)");
        // if user bid higher than expect
        let data = [
            &selector[..],
            &contract::address().into_array(),
            &self.auctions.setter(id.clone()).bidder.get().into_array(),
            &token_id.to_be_bytes::<32>(),
        ].concat();
        let _ = RawCall::new().call(contract, &data);
        // else
        // let data = [
        //     &selector[..],
        //     &contract::address().into_array(),
        //     &self.auctions.setter(id.clone()).owner.get().into_array(),
        //     &token_id.to_be_bytes::<32>(),
        // ].concat();
        // let _ = RawCall::new().call(contract, &data);
    }
}
