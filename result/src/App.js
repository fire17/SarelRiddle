import React from 'react';
import './App.css';
import BinPacker from './BinPacker/BinPacker'
import { data } from './assets/const';




// const result = Object.keys(data).map((setOfRectangles) => {
//   return <BinPacker data={data[setOfRectangles]} name={setOfRectangles} />
// })

const ExampleSetA = data['ExampleSetA']
function App() {
  return (
    <BinPacker data={ExampleSetA} name={'ExampleSetA'} />
  );
}

export default App;
