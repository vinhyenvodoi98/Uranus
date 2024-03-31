import AuctionItem from "../components/AuctionItem";

export default function ExplorePage() {
  return (
    <div className="bg-base-100">
      <div className="mx-8">
        <p className="text-6xl uppercase">Explore</p>
        <div className="divider"></div>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 bg-base-200 min-h-[500px]">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" name="my-accordion-1" />
              <div className="collapse-title text-xl font-medium">
                <p className="text-xl uppercase">Price</p>
              </div>
              <div className="collapse-content flex flex-col gap-4">
                <div className="flex justify-between gap-2 items-center">
                  <input
                    type='number'
                    placeholder='Min'
                    className='input input-bordered w-full rounded-md z-10'
                  />
                  <p className="text-lg uppercase">To</p>
                  <input
                    type='number'
                    placeholder='Max'
                    className='input input-bordered w-full rounded-md z-10'
                  />
                </div>
                <button className="btn btn-primary">Apply</button>
              </div>
            </div>
            <div className="divider"></div>
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" name="my-accordion-1" />
              <div className="collapse-title text-xl font-medium">
                <p className="text-xl uppercase">Currency</p>
              </div>
              <div className="collapse-content flex flex-col gap-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <input type="checkbox" defaultChecked className="checkbox" />
                  <span className="label-text">ETH</span>
                </label>
              </div>
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <div className="grid grid-cols-4 gap-4 place-items-center">
              {["1","2","3","4","5","6"].map(v =>(
                <AuctionItem key={v} id={v}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}