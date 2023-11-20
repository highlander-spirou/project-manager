import { useState } from 'react';
import './animated.css'
import { PlusIcon } from '@radix-ui/react-icons'

const AnimatedButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setTimeout(() => setIsHovered(true), 250)
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    console.log('click')
  }
  return <>
    <button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="button border-[1px] border-gray-300 rounded-full w-9 hover:w-32 h-9 flex justify-center items-center"
    >
      {isHovered ? <span className='font-semibold'>New job</span> : <PlusIcon />}
    </button>
  </>
};

export default AnimatedButton;
