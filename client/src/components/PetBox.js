import React from "react";

const PetBox = ({ pet }) => (
  <div className="pet">
    <figure>
      <img src={pet.img + `?pet=${pet.id}`} alt="" />
    </figure>
    <div className="pet-name">{pet.name}</div>
    <div className="pet-type">{pet.type}</div>
    {pet.isVaccinated && <div>This pet is vaccinated</div>}
  </div>
);

export default PetBox;
