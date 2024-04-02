/**
 * This file was automatically generated by Stylus and represents a Rust program.
 * For more information, please see [The Stylus SDK](https://github.com/OffchainLabs/stylus-sdk-rs).
 */

interface IAuctionContract {
    function owner() external view returns (string memory);

    function startAuction(address _contract, uint256 token_id, uint256 current_price, uint256 expected_price, uint256 start_time, uint256 end_time) external;

    function placeBid(address _contract, uint256 token_id) external payable;

    function endAuction(address _contract, uint256 token_id) external;
}

interface IUranus is IAuctionContract {
    function getOwner() external view returns (string memory);
}
