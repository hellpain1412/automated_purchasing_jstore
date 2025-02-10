import { Fragment } from "react/jsx-runtime";
import { PasswordMeterInput } from "./component";

function formatName(user: any) {
  return user.firstName + " " + user.lastName;
}

const user = {
  firstName: "Harper",
  lastName: "Perez",
};
function App() {
  console.log(user);

  return (
    <Fragment>
      <PasswordMeterInput />
    </Fragment>
  );
}

export default App;
