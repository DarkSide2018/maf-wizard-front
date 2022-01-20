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
                                    <DropDownRole role={'Sheriff'}>

                                    </DropDownRole>
                                </td>
                                <td key={generateGuid()}>
                                    <DropDownRole role={'Don'}>

                                    </DropDownRole>
                                </td>
                                <td key={generateGuid()}>
                                    <DropDownRole role={'Maf-1'}>

                                    </DropDownRole>
                                </td>
                                <td key={generateGuid()}>
                                    <DropDownRole role={'Maf-2'}>

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