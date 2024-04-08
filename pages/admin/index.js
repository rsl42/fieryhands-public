import { Form, ButtonToolbar, Button, Panel } from "rsuite";
import { useState } from "react";
import { useRouter } from "next/router";
import { apiURL } from "../../config/urls";

export default function Admin() {
  const router = useRouter();
  const [pass, setPass] = useState(null);
  console.log(apiURL);

  const handlePass = () => {
    console.log(pass);
    if (pass == 12345) {
      sessionStorage.setItem('auth', true);
      router.push('admin/products');
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: '100vh'
      }}
    >
      <Panel style={{width: '400px'}} header={<h3>Admin</h3>} bordered>
        <Form fluid>
          <Form.Group controlId="pass">
            <Form.ControlLabel>Şifrə daxil edin</Form.ControlLabel>
            <Form.Control onChange={(e) => setPass(e)} name="pass" type="password"/>
          </Form.Group>
          <Form.Group>
            <ButtonToolbar>
              <Button appearance="primary" onClick={handlePass}>Yoxla</Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </Panel>
    </div>
  );
}
