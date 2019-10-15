import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const ALL_PETS = gql`
  query AllPets {
    pets {
      name
      id
      img
    }
  }
`;

const NEW_PET = gql`
  mutation CreateAPet($newPet: NewPetInput!) {
    addedPet: addPet(input: $newPet) {
      id
      name
      type
      img
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data = {}, isLoading, error } = useQuery(ALL_PETS);
  const [createPet, newPet = {}] = useMutation(NEW_PET);

  const { loading: isNewPetloading, data: dataMutation = {}, error: isNewPetError } = newPet;
  const { addedPet } = dataMutation;

  debugger;
  // newPet -> {data, isMutationLoading, error}

  const { pets } = data;
  debugger;

  if (isLoading || isNewPetloading) {
    return <Loader />;
  }

  if (error || isNewPetError) {
    return <div>There was an error!</div>;
  }

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
