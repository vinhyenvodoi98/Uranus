import { Dispatch, forwardRef, SetStateAction, useState } from 'react';
type Props = {
  gridColors: string[][];
  setCoordinates: Dispatch<SetStateAction<{ x: number; y: number }>>;
};
const Broad: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { gridColors, setCoordinates }: Props,
  ref
) => {
  const gridRows = 20;
  const gridCols = 20;
  const cellSize = 16;
  const [cellHover, setCellHover] = useState<any>(null);

  const onSelectCell = ({ row, col }: any) => {
    setCoordinates({ x: row, y: col });
    setCellHover({ x: row, y: col });
  };

  const generateGridCells = () => {
    const gridCells = [];

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const cellColor = gridColors[row]![col];
        gridCells.push(
          <div
            key={`${row}-${col}`}
            className='cursor-pointer transition duration-300'
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              backgroundColor: cellColor,
              boxShadow:
                cellHover && cellHover.x === row && cellHover.y === col
                  ? 'inset 0 0 0 0.5px rgba(0, 0, 0, 0.5)'
                  : '0 0 0 0 rgba(0, 0, 0, 0)',
            }}
            onClick={() => onSelectCell({ row, col })}
          ></div>
        );
      }
    }

    return gridCells;
  };

  return (
    <div ref={ref} className='flex items-center flex-col'>
      <div className='flex flex-wrap w-[324px] border-2 border-black'>{generateGridCells()}</div>
    </div>
  );
};

export default forwardRef(Broad);