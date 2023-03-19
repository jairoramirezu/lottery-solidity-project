import React, { useState, useEffect } from "react";
import "./App.css";
import lottery from "./lottery";
import web3 from "./web3";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      setManager((prev) => manager);
      setPlayers((prev) => players);
      setBalance((prev) => balance);
    }

    fetchData();
  }, [])
;
  async function handleSubmit(event) {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMsg("Waiting on transaction success...");
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
      gas: 1000000,
    });
    setMsg("You have been entered!");
  };

  async function handleClick() {
    const accounts = await web3.eth.getAccounts();
    setMsg("Waiting on transaction success...");
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    setMsg("A winner has been picked!");
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}
        <br />
        There are currently {players.length} people entered
        <br />
        competing to win {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={handleSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter: </label>
          <input
            value={value}
            onChange={(e) => setValue((prev) => e.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={handleClick}>Pick a winner!</button>
      <hr />
      <h1>{msg}</h1>
    </div>
  );
}

export default App;
