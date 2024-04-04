/// Use an efficient WASM allocator
use core::marker::PhantomData;
// use alloc::{string::String, vec::Vec};
/// Import items from the SDK. The prelude contains common traits and macros.
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    msg,
    block,
    contract,
    call::RawCall,
    call::transfer_eth,
    function_selector,
    prelude::*
};

// sol! {
//     error NotOwner();
// }

pub trait AuctionParams {
    const OWNER: &'static str;
}

// Define some persistent storage using the Solidity ABI.
// `AuctionContract` will be the entrypoint.
sol_storage! {
    pub struct AuctionContract<T> {
        mapping(uint256 => Auction) auctions;
        uint256 auction_id;
        /// Used to allow [`AuctionParams`]
        PhantomData<T> phantom;
    }

    pub struct Auction {
        address highest_bidder;
        address owner;
        address contract;
        uint256 token_id;
        uint256 start_price;
        uint256 expected_price;
        uint256 start_time;
        uint256 end_time;
        mapping(address => uint256) bidder;
    }
}

// pub enum AuctionError {
//     NotOwner,
// }

// impl Error for AuctionError {}

// impl From<AuctionError> for Vec<u8> {
//     fn from(err: AuctionError) -> Vec<u8> {
//         match err {
//             AuctionError::NotOwner => b"caller is not owner".to_vec(),
//         }
//     }
// }

// pub type AutionResult<T> = Result<T, AuctionError>;

impl<T: AuctionParams> AuctionContract<T> {}

#[external]
impl<T: AuctionParams> AuctionContract<T> {
    /// Gets the number from storage.
    pub fn owner(&self) -> Result<String, Vec<u8>> {
        Ok(T::OWNER.into())
    }

    pub fn start_auction(
        &mut self,
        token_contract: Address,
        token_id: U256,
        start_price: U256,
        expected_price: U256,
        start_time:U256,
        end_time: U256
    ) -> Result<(), Vec<u8>> {
        // verify owner
        let selector = function_selector!("ownerOf(uint256)");
        let data = [
            &selector[..],
            &token_id.to_be_bytes::<32>(),
        ].concat();
        let nft_owner = RawCall::new()
            .gas(2100)                       // supply 2100 gas
            .limit_return_data(0, 32)        // only read the first 32 bytes back
            .call(token_contract, &data);

        if nft_owner.is_ok_and(|nft_owner| String::from_utf8_lossy(&nft_owner).into_owned() != msg::sender().to_string() ) {
            panic!("Not owner")
        }

        // start price > 0
        let transfer_selector = function_selector!("safeTransferFrom(address,address,uint256)");
        let transfer_data = [
            &transfer_selector[..],
            &msg::sender().into_array(),
            &contract::address().into_array(),
            &token_id.to_be_bytes::<32>(),
        ].concat();
        let _ = RawCall::new()
            .gas(2100)
            .call(token_contract, &transfer_data);

        let id = self.auction_id.get();
        let mut binding = self.auctions.setter(id);

        binding.owner.set(msg::sender());
        binding.highest_bidder.set(Address::ZERO);
        binding.start_price.set(start_price);
        binding.expected_price.set(expected_price);
        binding.contract.set(token_contract);
        binding.token_id.set(token_id);
        binding.start_time.set(start_time);
        binding.end_time.set(end_time);

        // update auction id
        let number = self.auction_id.get();
        self.auction_id.set(number + U256::from(1));
        Ok(())
    }

    pub fn get_contract_of_auction(&self, auction_id: U256) -> Result< Address, Vec<u8>> {
        let result = self.auctions.get(auction_id);
        Ok(result.contract.get())
    }

    pub fn get_token_id_of_auction(&self, auction_id: U256) -> Result< U256, Vec<u8>> {
        let result = self.auctions.get(auction_id);
        Ok(result.token_id.get())
    }

    pub fn get_highest_bider_id_of_auction(&self, auction_id: U256) -> Result< U256, Vec<u8>> {
        let result = self.auctions.get(auction_id);
        Ok(result.token_id.get())
    }

    pub fn get_current_price(&self, auction_id: U256) -> Result< U256, Vec<u8>> {
        let binding = self.auctions.get(auction_id);
        if binding.highest_bidder.get() == Address::ZERO {
            Ok(binding.start_price.get())
        } else {
            Ok(binding.bidder.get(binding.highest_bidder.get()))
        }
    }

    #[payable]
    pub fn place_bid(
        &mut self,
        auction_id: U256
    ) {
        // check if auction end
        if U256::from(block::timestamp()) > self.auctions.get(auction_id).end_time.get() {
            panic!("Auction have been end")
        }

        // value must higher than current_price
        let mut binding = self.auctions.setter(auction_id);
        let highest_bidder = binding.highest_bidder.get();
        let highest_bid = binding.bidder.get(highest_bidder);
        let mut to_user_bid = binding.bidder.setter(msg::sender());
        let user_bid = to_user_bid.get() + U256::from(msg::value());

        if user_bid > highest_bid {
            to_user_bid.set(user_bid);
            binding.highest_bidder.set(msg::sender());
        }
    }

    pub fn end_auction(
        &mut self,
        auction_id: U256
    ) -> Result< (), Vec<u8>> {
        // check if auction end
        if U256::from(block::timestamp()) <= self.auctions.get(auction_id).end_time.get() {
            panic!("Auction have not end yet")
        }

        let selector = function_selector!("transferFrom(address,address,uint256)");

        let binding = self.auctions.setter(auction_id);
        let highest_bidder = binding.highest_bidder.get();
        let highest_bid = binding.bidder.get(highest_bidder);
        let expected_price = binding.expected_price.get();
        let auction_owner = binding.owner.get();
        let contract =  binding.contract.get();
        let token_id =  binding.token_id.get();
        // if user bid higher than expect
        if highest_bid > expected_price {
            let data = [
                &selector[..],
                &contract::address().into_array(),
                &self.auctions.get(auction_id).highest_bidder.get().into_array(),
                &token_id.to_be_bytes::<32>(),
            ].concat();
            let _ = RawCall::new().call(contract, &data);

            // transfer hishest_bid to owner
            transfer_eth(auction_owner, highest_bid)?;
        } else {
            let data = [
                &selector[..],
                &contract::address().into_array(),
                &self.auctions.get(auction_id).owner.get().into_array(),
                &token_id.to_be_bytes::<32>(),
            ].concat();
            let _ = RawCall::new().call(contract, &data);
        }
        Ok(())
    }

    pub fn withdraw(
        &mut self,
        auction_id: U256,
    ) -> Result< (), Vec<u8>> {
        let user_balance = self.auctions.setter(auction_id).bidder.get(msg::sender());
        if user_balance == U256::from(0) {
            panic!("Your balance is 0")
        }
        // transfer eth
        transfer_eth(msg::sender(), user_balance)?;
        self.auctions.setter(auction_id).bidder.setter(msg::sender()).set(U256::from(0));
        Ok(())
    }

    pub fn bidder_balance(
        &self,
        auction_id: U256,
        address: Address,
    ) -> Result<U256, Vec<u8>> {
        let balance = U256::from(self.auctions.get(auction_id).bidder.get(address));
        Ok(balance)
    }

    pub fn get_auction_id(&self) -> Result<U256, Vec<u8>> {
        Ok(self.auction_id.get())
    }

    pub fn get_contract_address(&self) -> Result<Address, Vec<u8>> {
        Ok(contract::address())
    }
}
