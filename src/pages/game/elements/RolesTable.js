import React from "react";
import {Card} from "react-bootstrap";
import {Table} from "reactstrap";
import {generateGuid} from "../GameTicketFast";
import DropDownRole from "../dropDowns/DropDownRole";

export class RolesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secondsElapsed: 0,
            incrementer: null
        };
    }

    render() {
        let pls = this.props.playersToSlot;
        console.log("pls=>" + JSON.stringify(pls))
        let shElement = pls.filter(it => it.role === 'Sheriff');
        let sheriffCurrentSlot = 0
        if (shElement.length > 0) {
            console.log("shElement=>" + JSON.stringify(shElement))
            sheriffCurrentSlot = shElement[0].slot
        }
        let donCurrentSlot = 0
        let donElem = pls.filter(it => it.role === 'Don');
        if (donElem.length > 0) {
            donCurrentSlot = donElem[0].slot
        }
        let maf1CurrentSlot = 0
        let maf1Elem = pls.filter(it => it.role === 'Maf-1');
        if (maf1Elem.length > 0) {
            maf1CurrentSlot = maf1Elem[0].slot
        }
        let maf2CurrentSlot = 0
        let maf2Elem = pls.filter(it => it.role === 'Maf-2');
        if (maf2Elem.length > 0) {
            maf2CurrentSlot = maf2Elem[0].slot
        }
        return (
            <div>
                <Card className={"bg-dark text-white"}>
                    <Card.Body>
                        <Table bordered variant="dark">
                            <thead className={"text-white"}>
                            <tr key={generateGuid()}>
                                <th>Шериф</th>
                                <th>Дон</th>
                                <th>Мафиози-1</th>
                                <th>Мафиози-2</th>
                            </tr>
                            </thead>
                            <tbody className={"text-white"}>
                            <tr>
                                <td key={generateGuid()}>
                                    <DropDownRole role={'Sheriff'} currentSlot={sheriffCurrentSlot}>

                                    </DropDownRole>
                                </td>
                                <td key={generateGuid()}>
                                    <DropDownRole role={'Don'} currentSlot={donCurrentSlot}>

                                    </DropDownRole>
                                </td>
                                <td key={generateGuid()}>
                                    <DropDownRole role={'Maf-1'} currentSlot={maf1CurrentSlot}>

                                    </DropDownRole>
                                </td>
                                <td key={generateGuid()}>
                                    <DropDownRole role={'Maf-2'} currentSlot={maf2CurrentSlot}>

                                    </DropDownRole>
                                </td>
                            </tr>

                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}