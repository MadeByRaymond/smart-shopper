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
        d="M26.281 3.511A1.512 1.512 0 0024.761 2H5.52A1.511 1.511 0 004 3.511v24.103a1.511 1.511 0 001.52 1.511h.505V4.005H26.28v-.494z"
        fill={props.fillColor ? props.fillColor : "#fff"}
      />
      <Path
        d="M28.703 5.875H9.328c-.802 0-1.453.65-1.453 1.453v24.219c0 .802.65 1.453 1.453 1.453h19.375c.803 0 1.453-.65 1.453-1.453V7.328c0-.802-.65-1.453-1.453-1.453z"
        fill={props.fillColor ? props.fillColor : "#fff"}
      />
    </Svg>
  )
}

export default SvgComponent
