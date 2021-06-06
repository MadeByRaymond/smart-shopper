import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M19.992 23.05L28 15l-8.008-8.05a.834.834 0 10-1.159 1.175l5.992 6.042H4.146a.833.833 0 100 1.666h20.679l-5.992 6.042a.834.834 0 101.184 1.175h-.025z"
        fill={props.colorScheme == 'dark' ? "#FFFFFF" : props.theme.primaryColor}
        fillOpacity={0.9}
      />
    </Svg>
  )
}

export default SvgComponent
