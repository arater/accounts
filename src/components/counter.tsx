import React, {useState} from 'react';
import styled from 'styled-components';


const Counter = () => {
    const [count,setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    return(
        <div className='App'>
            <div>Count: {count}</div>
            <div>
                <button onClick={increment}>Increment</button>
            </div>
            <div>
                <button onClick={decrement}>Decrement</button>
            </div>
        </div>
    );
};


export default Counter;
