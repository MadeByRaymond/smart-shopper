import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={35}
      height={35}
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M3.881 22.654l-1.835 7.92a1.99 1.99 0 001.932 2.416c.138.014.277.014.415 0l7.969-1.836 15.3-15.242-8.538-8.52L3.88 22.654zM32.473 8.281l-5.7-5.699a2 2 0 00-2.82 0L20.785 5.75l8.53 8.53 3.167-3.169a2.001 2.001 0 00-.01-2.83z"
        fill="#fff"
      />
    </Svg>
  )
}

export default SvgComponent
