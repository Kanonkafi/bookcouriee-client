import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export default function OrderModal({ book, onClose, onPlaceOrder }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg p-6 rounded">
        <h3 className="text-lg font-semibold mb-3">Place Order</h3>
        <form onSubmit={(e) => { e.preventDefault(); onPlaceOrder(); }}>
          <div className="mb-2">
            <label className="block">Name</label>
            <input defaultValue={user?.displayName} readOnly className="input input-bordered w-full" />
          </div>
          <div className="mb-2">
            <label>Email</label>
            <input defaultValue={user?.email} readOnly className="input input-bordered w-full"/>
          </div>
          <div className="mb-2">
            <label>Phone</label>
            <input name="phone" className="input input-bordered w-full" required/>
          </div>
          <div className="mb-2">
            <label>Address</label>
            <textarea name="address" className="textarea textarea-bordered w-full" required/>
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" type="submit">Place Order</button>
          </div>
        </form>
      </div>
    </div>
  );
}
