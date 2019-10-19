import React from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'

export default class URLBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      originalURL: undefined,
      _id: undefined
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    // TODO: this.state
  }

  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSubmit} maxwidth="500px">
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Control
                name="originalURL"
                required
                placeholder="Shorten your link"
                value={this.state.originalURL}
                onChange={this.handleChange}
                size="lg"
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <InputGroup as={Col} size="lg" md="10">
              <InputGroup.Prepend>
                <InputGroup.Text>{process.env.BASE_URL}</InputGroup.Text>
                <InputGroup.Text>/</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                name="_id"
                placeholder="Branded URL (optional)"
                value={this.state._id}
                onChange={this.handleChange}
              />
            </InputGroup>
            <Col md>
              <Button variant="primary" type="submit" size="lg">
                Shorten
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </Container>
    )
  }
}
