
import './App.css';
import PercentageDisplay from './components/percentage/percentage';
import {Container, Row, Col} from 'react-bootstrap'

function App() {
  return (
    <Container fluid>

    
    <div className="App">
    <Row>
      <Col xs = {12}>
        <PercentageDisplay  />
      </Col>
    </Row>
    </div>
 
    </Container>
  );
}

export default App;
