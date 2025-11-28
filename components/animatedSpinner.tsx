import SpinnerGreen from "@/assets/spinner_green.svg";
import SpinnerRed from "@/assets/spinner_red.svg";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export default function AnimatedSpinner({isRed = false}) {
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotate, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
            {isRed ? <SpinnerRed width={20} height={20} /> :
                <SpinnerGreen width={20} height={20} />
            }
        </Animated.View>
    );
}
