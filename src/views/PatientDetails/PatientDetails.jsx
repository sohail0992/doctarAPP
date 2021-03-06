import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import SweetAlert from "sweetalert2-react";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      max: 100,
      value: 0,
      cardCount: 0,
      data: null,
      input: [],
      values: [],
      show: false,
      title: "",
      text: ""
    };

    this.addCard = this.addCard.bind(this);
    this.addMoreCards = this.addMoreCards.bind(this);
    this.removeCards = this.removeCards.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.myBestTreatments();
  }

  myBestTreatments() {
    var headers = {
      "x-access-key": "KOOY-9CV8-RO09-Q43W"
    };
    axios
      .get("https://twin-patient.herokuapp.com/api/users/getTwins", {
        headers: headers
      })
      .then(response => {
        // console.log(response);
        this.setState({ cardCount: response.data.message.length });
        this.setState({ data: response.data });
        var treatment = [];
        for (var i = 0; i < response.data.message.length; i++) {
          treatment.push(response.data.message[i].twins);
        }
        this.setState({ values: treatment });
        console.log(this.state.values, "data");
      })
      .catch(error => {
        console.log(error);
      });
  }

  onChange(value) {
    this.setState({ inputvalue: value });
  }
  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <form>
            <Card>
              <SweetAlert
                show={this.state.show}
                title={this.state.title}
                text={this.state.text}
                onConfirm={() => this.setState({ show: false })}
              />
              <CardHeader color="primary">
                <Button onClick={this.addMoreCards}>Add</Button>
                {/* <Button onClick={this.removeCards}>Remove</Button> */}
                <Button onClick={this.handleEdit}>Edit</Button>
-              </CardHeader>
              {this.cards()}
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    );
  }

  handleEdit() {
    var cardCount = this.state.cardCount;
    var treatment = [];
    for (var i = 0; i < cardCount; i++) {
      treatment.push(this.state.values[i]);
    }
    var allTreatment = treatment.join(";");
    // allTreatment = allTreatment.replace('[]', '');
    console.log(allTreatment, "treatment");

    var headers = {
      "x-access-key": "KOOY-9CV8-RO09-Q43W"
    };

    var data = {
      treatment: allTreatment
    };
    axios
      .post(
        "https://twin-patient.herokuapp.com/api/users/editTwin",
        data,
        { headers: headers }
      )
      .then(response => {
        this.myBestTreatments();
        this.setState({ show: true , title:"Success", text:"Twin Updated Successfully"})
      })
      .catch(error => {
        console.log(error);
      });
  }

  enterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) {
      var cardCount = this.state.cardCount;
      var treatment = [];
      for (var i = 0; i < cardCount; i++) {
        console.log(this.state.values[i], "all other");
        treatment.push(this.state.values[i]);
      }
      var allTreatment = treatment.join(";");
      // allTreatment = allTreatment.replace('[]', '');
      console.log(allTreatment, "treatment");

      var headers = {
        "x-access-key": "KOOY-9CV8-RO09-Q43W"
      };

      var data = {
        twins: allTreatment
      };
      axios
        .post(
          "https://twin-patient.herokuapp.com/api/users/editTwin",
          data,
          { headers: headers }
        )
        .then(response => {
          this.myBestTreatments();
          console.log("response",response)
          this.setState({ show: true , title:"Success", text:"Twin Added Successfully"})
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  addMoreCards() {
    var cardCount = this.state.cardCount;
    this.setState({ cardCount: cardCount + 1 });
  }

  removeCards() {
    var cardCount = this.state.cardCount;
    if (cardCount > 0) {
      console.log(this.state.cardCount, "t");
      console.log(this.state.values[cardCount - 1], "t");
      this.setState({ cardCount: cardCount - 1 });
      var treatment = [];
      for (var i = 0; i < cardCount - 1; i++) {
        console.log(this.state.values[i], "all other");
        treatment.push(this.state.values[i]);
      }
      var allTreatment = treatment.join(";");
      // allTreatment = allTreatment.replace('[]', '');
      console.log(allTreatment, "treatment");

      var headers = {
        "x-access-key": "KOOY-9CV8-RO09-Q43W"
      };

      var data = {
        twins: allTreatment
      };
      axios
        .post(
          "https://twin-patient.herokuapp.com/api/users/deleteTreatment",
          data,
          { headers: headers }
        )
        .then(response => {
          this.myBestTreatments();
          this.setState({ show: true , title:"Success", text:"Treatment Added Successfully"})
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  handleChange(i, e) {
    var newValues = this.state.values.slice();
    newValues[i] = e.target.value;
    this.setState({ values: newValues });
  }

  addCard(cards) {
    var fieldsArray = [];
    for (var i = 0; i < cards; i++) {
      fieldsArray.push(
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <TextField
              // label="Patient 1"
              fullWidth
              margin="normal"
              value={this.state.values[i]}
              name={this.state.values[i]}
              onKeyPress={this.enterPressed.bind(this)}
              onChange={this.handleChange.bind(this, i)}
              required
            />
          </GridItem>
        </GridContainer>
      );
    }
    return <CardBody>{fieldsArray}</CardBody>;
  }

  cards() {
    return this.addCard(this.state.cardCount);
  }
}

export default withStyles(styles)(Dashboard);