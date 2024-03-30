import { Dispatch, SetStateAction } from "react";

type ColorOptions = {
  red: string;
  blue: string;
  yellow: string;
};
type Props={
  colorOptions:ColorOptions,
  coordinates:{x:number,y:number},
  setSelectedColor:Dispatch<SetStateAction<string>>,
  placePixel: (() => void) | undefined ;
  selectedColor: string
}

const Palette = ({colorOptions,coordinates,placePixel,setSelectedColor,selectedColor}:Props) => {
  return (
    <div className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 bg-white border-2 border-gray-900 rounded-lg">
      <button
        className="text-center mb-2 w-full rounded-lg py-2 text-white border-2 border-black hover:cursor-pointer hover:bg-red-500 bg-red-600"
        onClick={placePixel}
      >
        Place (${coordinates.x+","+coordinates.y})
      </button>
      <div>
        {
          Object.entries(colorOptions).map(([colorName, colorCode]) => (
            <button
              key={colorName}
              style={{
                backgroundColor: colorCode,
                boxShadow: (selectedColor === colorCode) ? "inset 0 0 0 3px rgba(0, 0, 0, 5)" : "0 0 0 0 rgba(0, 0, 0, 0)"
              }}
              onClick={()=>setSelectedColor(colorCode)}
              className='w-16 h-12 border-black border-2 mx-1 hover:opacity-60 hover:cursor-pointer'
            >
            </button>
          ))
        }
      </div>
    </div>
  )
}

export default Palette;