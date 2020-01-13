import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Button, List, Image, Header, Icon, Form } from 'semantic-ui-react';

const initValues = {id: '', name: '', bio: ''}

function App() {
  const [userList, setUserList] = useState({});
  const [userForm, setUserForm] = useState(initValues)

  useEffect(() => {
    axios.get('http://localhost:8000/api/users')
      .then(res => setUserList(res.data))
      .catch(err => console.log(err))
  }, [])

  const handleChange = e => {
    setUserForm({
        ...userForm,
        [e.target.name]: e.target.value
    })
  }

  const handleSelect = userId => {
    setUserForm(userList.find(user => user.id === userId))
  }

  const handleSubmit = e => {
    e.preventDefault();

    if(userForm.id){
      // update
      axios.put(`//localhost:8000/api/users/${userForm.id}`, {name: userForm.name, bio: userForm.bio})
        .then(res => {
          setUserList(userList.map(user => {
            if (user.id === userForm.id){
              return {
                ...user,
                name: userForm.name,
                bio: userForm.bio
              }
            }else{
              return user
            }
          }))
          setUserForm(initValues)
        })
        .catch(err => console.log(err))
    }else{
      // add
      axios.post('//localhost:8000/api/users', {name: userForm.name, bio: userForm.bio})
        .then(user => {

          if(userList.find(user => user.id === userForm.id) === undefined){
            setUserList([...userList, userForm]);
            setUserForm(initValues)
          }

        })
        .catch(err => console.log(err))
    }
  }

  const clearForm = e => {
    e.preventDefault();
    setUserForm(initValues);
  }

  const deleteUser = (userId) => {
    // console.log(userId)
    axios.delete(`//localhost:8000/api/users/${userId}`)
      .then(res => {
        setUserList(userList.filter(user => user.id !== userId))
      })
      .catch(err => console.log(err))
  }

  return (
    <Container>
      <Header as='h2'>
        <Icon name="users" />
        <Header.Content>Users</Header.Content>
      </Header>
      <Grid columns={2} divided>
        <Grid.Row stretched>
          <Grid.Column>
            <List selection verticalAlign="middle">
              {
                userList.length &&
                userList.map(user => (
                  <List.Item key={user.id}>
                    <List.Content floated="right">
                      <Icon name="trash alternate outline" onClick={() => deleteUser(user.id)} />
                    </List.Content>
                    <Image avatar src='https://react.semantic-ui.com/images/avatar/small/veronika.jpg' />
                    <List.Content onClick={() => handleSelect(user.id)}>
                      <List.Header as="a">{user.name}</List.Header>
                      <List.Description>{user.bio}</List.Description>
                    </List.Content>
                  </List.Item>
                ))
              }
            </List>
          </Grid.Column>
          <Grid.Column>
            {/* Form */}
            <Form onSubmit={handleSubmit}>
              <Form.Input label="Name" placeholder="Name" name="name" value={userForm.name} onChange={handleChange} />
              <Form.Input label="Bio" placeholder="Bio" name="bio" value={userForm.bio} onChange={handleChange} />
              <Button type="submit">Save</Button>
              <Button type="button" onClick={clearForm}>Clear</Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default App;
