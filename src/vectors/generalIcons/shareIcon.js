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
        d="M26.927 23.611a4.865 4.865 0 00-3.504 1.509l-11.864-5.937a4.351 4.351 0 000-2.725l11.883-6.044a4.983 4.983 0 10-1.041-1.655l-11.767 5.986a4.866 4.866 0 100 6.16l11.738 5.908a4.799 4.799 0 00-.302 1.665 4.866 4.866 0 104.866-4.867h-.01z"
        fill={props.fillColor ? props.fillColor : "#fff"}
      />
    </Svg>
  )
}

export default SvgComponent
