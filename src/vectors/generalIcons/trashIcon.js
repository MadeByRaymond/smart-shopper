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
        d="M5.938 8.781v21.313A2.838 2.838 0 008.708 33h17.66a2.84 2.84 0 002.82-2.906V8.78H5.938zm8.718 19.375H12.72V13.625h1.937v14.531zm7.75 0H20.47V13.625h1.937v14.531zM29.895 4.906h-7.489v-.968A1.938 1.938 0 0020.47 2h-6.007a1.937 1.937 0 00-1.743 1.938v.968h-7.75a.969.969 0 000 1.938h24.926a.969.969 0 000-1.938z"
        fill="#fff"
      />
    </Svg>
  )
}

export default SvgComponent
