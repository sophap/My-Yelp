import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import { listRestaurants } from "./graphql/queries";
import {
  createRestaurant as createRestaurantMutation,
  deleteRestaurant as deleteRestaurantMutation,
} from "./graphql/mutations";

const App = ({ signOut }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchRests();
  }, []);

  async function fetchRests() {
    const apiData = await API.graphql({ query: listRestaurants });
    const ordersFromAPI = apiData.data.listRestaurants.items;
    setOrders(ordersFromAPI);
  }

  async function createRestaurant(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      location: form.get("location"),
    };
    await API.graphql({
      query: createRestaurantMutation,
      variables: { input: data },
    });
    fetchRests();
    event.target.reset();
  }

  async function deleteRestaurant({ id }) {
    const newOrders = orders.filter((order) => order.id !== id);
    setOrders(newOrders);
    await API.graphql({
      query: deleteRestaurantMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <Heading level={1}>My Restaurants App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createRestaurant}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Restaurant Name"
            label="Restaurant Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Restaurant Description"
            label="Restaurant Description"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="location"
            placeholder="Location"
            label="Restaurant Location"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Restaurant
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Restaurants</Heading>
      <View margin="3rem 0">
        {orders.map((order) => (
          <Flex
            key={order.id || order.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {order.name}
            </Text>
            <Text as="span">{order.description}</Text>
            <Text as="span">{order.location}</Text>
            <Button variation="link" onClick={() => deleteRestaurant(order)}>
              Delete Restaurant
            </Button>
          </Flex>
        ))}
      </View>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);