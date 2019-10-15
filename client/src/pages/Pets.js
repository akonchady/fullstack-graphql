import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const PETS_FIELDS = gql`
  fragment PetsFields on Pet {
    id
    name
    type
    img
    isVaccinated @client
    owner {
      id
      age @client # This indicates this field is only on the client. Don't send to server
    }
  }
`;

const ALL_PETS = gql`
  query AllPets {
    pets {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;

const NEW_PET = gql`
  mutation CreateAPet($newPet: NewPetInput!) {
    addedPet: addPet(input: $newPet) {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data = {}, isLoading, error } = useQuery(ALL_PETS);
  const [createPet, newPet = {}] = useMutation(NEW_PET, {
    update(cache, response) {
      debugger;
      const {
        data: { addedPet }
      } = response;
      const { pets } = cache.readQuery({
        query: ALL_PETS
      });
      cache.writeQuery({
        query: ALL_PETS,
        data: {
          pets: pets.concat([addedPet])
        }
      });
    }
  });

  const {
    loading: isNewPetloading,
    data: dataMutation = {},
    error: isNewPetError
  } = newPet;
  const { addedPet } = dataMutation;

  debugger;
  // newPet -> {data, isMutationLoading, error}

  const { pets } = data;
  debugger;

  if (isLoading) {
    return <Loader />;
  }

  if (error || isNewPetError) {
    return <div>There was an error!</div>;
  }

  console.log(data.pets);

  const onSubmit = input => {
    setModal(false);
    const { type, name } = input;
    createPet({
      // pass variables
      variables: {
        newPet: {
          type,
          name
        }
      },
      optimisticResponse: {
        __typename: "Mutation",
        addedPet: {
          // This should look exactly like the response
          id: "23",
          img: "https://placedog.net/300/300?pet=SyervwfhN2pYFs5wLgU0F",
          name,
          type,
          __typename: "Pet"
        }
      }
    });
  };

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={pets} />
      </section>
    </div>
  );
}
