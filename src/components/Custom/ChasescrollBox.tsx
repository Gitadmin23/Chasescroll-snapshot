import React, { PropsWithChildren } from 'react'

interface IProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    bgColor?: string;
}

function ChasescrollBox({ width = '50px', height = '50px', borderRadius = '8px', children, borderColor = 'white', borderWidth = '1px', bgColor = 'white' }: IProps & PropsWithChildren) {
    return (
        <div style={{
            width: width,
            height: height,
            backgroundColor: bgColor,
            borderWidth: borderWidth,
            borderColor: borderColor,
            borderStyle: 'solid',
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            overflow: 'hidden'
        }}>

            {children}
        </div>
    )
}

export default ChasescrollBox
