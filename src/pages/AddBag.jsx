import { useState } from "react";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";

import "leaflet/dist/leaflet.css";

function AddBag() {
  const [loading, setLoading] = useState(false);
  const [bagStarted, setBagStarted] = useState(true);
  const [formData, setFormData] = useState({
    lake: "",
    date: "",
    fish: [{ species: "", weight: 0 }],
  });

  const { lake, date, fish, weight, species } = formData;
  //   const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    const newRow = { species: "", weight: 0 };

    setFormData((prevState) => ({
      ...prevState,
      fish: [...prevState.fish, newRow],
    }));
  };

  const onValUpdate = (i, event) => {
    const { id, value } = event.target;
    const data = [...fish];
    data[i][id] = value;

    console.log(formData);
    setFormData((prevState) => ({
      ...prevState,
      fish: data,
    }));
    console.log(formData);
  };

  const onMutate = (e) => {
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
    console.log(formData);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let totalWeight = 0;
    fish.forEach((key) => {
      totalWeight += Number(key.weight);
    });
    const roundedBag = totalWeight.toFixed(2);

    const formDataCopy = {
      ...formData,
      timestamp: serverTimestamp(),
      totalWeight: roundedBag,
      totalFish: formData.fish.length,
    };

    await addDoc(collection(db, "bags"), formDataCopy);
    toast.success("Bag submitted");
    setBagStarted(true);
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <div className="loadingScreen">
          <TailSpin
            height="80"
            width="80"
            color="#fff"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div className="profile">
          <header>
            <p className="pageHeader">Add Bag</p>
          </header>

          <main>
            <form onSubmit={onSubmit}>
              <div className="formSize flex">
                <div>
                  <label className="formLabel">Lake</label>
                  <input
                    className="formInputName"
                    type="text"
                    id="lake"
                    value={lake}
                    onChange={onMutate}
                    placeholder="Lake"
                    required
                  />
                </div>
                <div>
                  <label className="formLabel">Date</label>
                  <input
                    className="formInputName"
                    type="date"
                    id="date"
                    value={date}
                    onChange={onMutate}
                    placeholder="Date"
                    required
                  />
                </div>
              </div>

              {bagStarted && (
                <>
                  <div className="formSize flex">
                    <div>
                      <label className="formLabel">Species</label>
                    </div>
                    <div>
                      <label className="formLabel">Weight (Ex: 1.50lbs)</label>
                    </div>
                  </div>

                  {fish.map((fishes, key) => (
                    <div key={key} className="formSize flex">
                      <div>
                        <select
                          onChange={(event) => onValUpdate(key, event)}
                          className="formInputName"
                          value={species}
                          name={species}
                          id="species"
                          required
                        >
                          <option value="" disabled selected hidden>
                            Select Your Species
                          </option>
                          <option value="Largemouth Bass">
                            Largemouth Bass
                          </option>
                          <option value="Smallmouth Bass">
                            Smallmouth Bass
                          </option>
                        </select>
                      </div>
                      <div>
                        <input
                          className="formInputName"
                          type="number"
                          id="weight"
                          value={weight}
                          name={weight}
                          onChange={(event) => onValUpdate(key, event)}
                          placeholder="Weight"
                          key={key}
                          step=".01"
                          required
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    className="primaryButton addFishButton"
                    onClick={handleClick}
                  >
                    Add Fish
                  </button>
                </>
              )}

              <button
                type="submit"
                className="primaryButton createListingButton"
              >
                Submit Bag
              </button>
            </form>
          </main>
        </div>
      )}
    </div>
  );
}

export default AddBag;
