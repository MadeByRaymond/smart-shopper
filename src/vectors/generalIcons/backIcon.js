import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width={18}
      height={16}
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M6.824 1.108L0 7.968l6.824 6.86a.71.71 0 10.987-1.002L2.706 8.678H17.29a.71.71 0 000-1.42H2.706L7.81 2.108a.71.71 0 10-1.008-1.001h.021z"
        fill= {props.colors ? props.colors.textPrimary : "#021032"}
      />
    </Svg>
  )
}

export default SvgComponent
