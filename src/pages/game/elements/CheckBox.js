import React from "react";

export function Checkbox() {
    const [checked1, setChecked1] = React.useState(false);
    const [checked2, setChecked2] = React.useState(false);
    const [checked3, setChecked3] = React.useState(false);
    const [checked4, setChecked4] = React.useState(false);

    return (
        <label>
            <input type="checkbox"
                   className={"styled-checkbox"}
                   defaultChecked={checked1}
                   onChange={() => setChecked1(!checked2)}
            />
            <input type="checkbox"
                   className={"styled-checkbox"}
                   defaultChecked={checked2}
                   onChange={() => setChecked2(!checked2)}
            />
            <input type="checkbox"
                   className={"styled-checkbox"}
                   defaultChecked={checked3}
                   onChange={() => setChecked3(!checked3)}
            />
            <input type="checkbox"
                   className={"styled-checkbox"}
                   defaultChecked={checked4}
                   onChange={() => setChecked4(!checked4)}
            />
        </label>
    );
}