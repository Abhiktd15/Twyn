import { View } from 'react-native'
import React, { ReactNode } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SafeScreen = ({children}: {children: ReactNode}) => {
    const insets = useSafeAreaInsets()
    return (
        <View style={{ flex: 1, paddingTop: insets.top}}>
            {children}
        </View>
    )
}

export default SafeScreen