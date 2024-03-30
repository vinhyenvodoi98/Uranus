export default function FrameBoard({board}: {board:string[][]}) {
  const generateGridCells = () => {
    const gridRows = 20;
    const gridCols = 20;
    const gridCells = [];

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const cellColor = board[row]![col];
        gridCells.push(
          <div
            key={`${row}-${col}`}
            tw={`bg-white h-10 w-10 bg-[${cellColor}]`}
          ></div>
        );
      }
    }

    return gridCells;
  };

  return (
    <div tw='flex items-center flex-col'>
      <div tw='flex flex-wrap w-[800px]'>{generateGridCells()}</div>
    </div>
  );
}