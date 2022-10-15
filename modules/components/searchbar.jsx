import { Box, InputAdornment, TextField } from "@mui/material"
import { BiBarcodeReader } from "react-icons/bi"
import { Component } from "react"

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textFieldValue: "",
      textFieldError: false,
      textFieldErrorMsg: "",
    }

    this.props.actions({ 
      showError: this.handleError.bind(this)
    })
  }

  setTextFieldError(flag) {
    this.setState({ textFieldError: flag })
  }

  setTextFieldErrorMsg(msg) {
    this.setState({ textFieldErrorMsg: msg })
  }

  handleError(violations) {
    const errorFeedback =
      violations.map(violation => violation.violationMessage).join(" | ");

    this.setTextFieldErrorMsg(errorFeedback);
    this.setTextFieldError(true);
  }

  handleTextField(e) {
    this.setTextFieldErrorMsg("");
    this.setTextFieldError(false)
    if (e.target.value.length <= 13)
      this.setState({ textFieldValue: e.target.value })
  }

  handleKeyUp({ key }) {
    if (key === "Enter") {
      this.props.searchByBarcode(this.state.textFieldValue)
    }
  }

  render() {
    return (
      <Box>
        <TextField
          id="outlined-basic"
          label="Search by barcode"
          variant="outlined"
          error={this.state.textFieldError}
          helperText={this.state.textFieldErrorMsg}
          size="small"
          className="w-full"
          value={this.state.textFieldValue}
          onChange={this.handleTextField.bind(this)}
          onKeyUp={this.handleKeyUp.bind(this)}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <BiBarcodeReader
                className="text-2xl hover:text-black active:text-red-600 hover:cursor-pointer active:cursor-default"
              />
            </InputAdornment>
          }}
        />
      </Box>
    )
  }
}

export default SearchBar;