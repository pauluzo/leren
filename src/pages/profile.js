import React from "react";
import { withRouter } from "react-router-dom";
import StudentPage from "./studentpage";
import InstructorPage from "./instructpage";

 class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStudent: (props.location.state === "student" ? true : false)
    }
  }

  resetState = (newState) => this.setState(newState);

  render() {
    return(
      <>
        {
          this.state.isStudent ? <StudentPage resetProfile={this.resetState} />
          : <InstructorPage resetProfile={this.resetState} /> 
        }
      </>
    );
  }
}

export default withRouter(Profile);