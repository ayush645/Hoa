import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  handleCreateUnitsAPi,
  getAllUnitsApi,
  deleteUnitsApi,
} from "../services/operation/function";
import GetUnits from "../components/GetUnits";

const Units = () => {

  const [propertyData, setPropertyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();


  const fetchUnits = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getAllUnitsApi(id);
      setPropertyData(data);
    } catch (error) {
      console.error("Error fetching property information:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUnits();
  }, [id]);

  return (
    <div className="p-6 min-h-screen">
 
      <GetUnits
        propertyData={propertyData}
        loading={loading}
   
      />
    </div>
  );
};

export default Units;
