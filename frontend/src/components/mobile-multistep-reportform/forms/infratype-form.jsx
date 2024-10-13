import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner"; // Import the Spinner component
import {
  Zap,         // Power and Energy
  Droplet,      // Water and Waste
  Car,          // Transportation
  Wifi,         // Telecommunications
  Building,    // Commercial
} from 'lucide-react'; // Import icons

const InfraTypeForm = ({ infraType, setInfraType }) => {
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const iconMapping = {
    "Power and Energy": <Zap size={20} className='text-muted-foreground'/>,
    "Water and Waste": <Droplet size={20} className='text-muted-foreground'/>,
    "Transportation": <Car size={20} className='text-muted-foreground'/>,
    "Telecommunications": <Wifi size={20} className='text-muted-foreground'/>,
    "Commercial": <Building size={20} className='text-muted-foreground'/>,
  };

  const descriptionMapping = {
    "Power and Energy": "BENECO provides reliable electricity services for your daily needs.",
    "Water and Waste": "Baguio Water District ensures clean and safe drinking water.",
    "Transportation": "Local transport services make commuting easy and convenient.",
    "Telecommunications": "Stay connected with fast internet and mobile networks.",
    "Commercial": "Various businesses cater to your everyday needs in the city.",
  };

  useEffect(() => {
    const fetchInfrastructureTypes = async () => {
      setLoading(true); // Set loading to true before fetching
      const response = await fetch("/api/infrastructure-types");
      const data = await response.json();
      setInfrastructureTypes(data);
      setLoading(false); // Set loading to false after fetching
    };

    fetchInfrastructureTypes();
  }, []);

  return (
    <div>
      {loading ? ( // Show spinner while loading
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <RadioGroup value={infraType} onValueChange={setInfraType}>
          <div className="flex flex-wrap gap-4">
            {infrastructureTypes.map((infra) => (
              <div
                key={infra._id}
                className={`flex flex-col justify-top p-4 border rounded-lg cursor-pointer transition ${
                  infraType === infra._id ? "border-gray-300 bg-gray-100" : "border"
                } max-w-[250px] min-h-[100px]`} // Use max-w-sm for fixed width
                onClick={() => setInfraType(infra._id)}
              >
                <RadioGroupItem value={infra._id} id={infra._id} className="hidden" />
                <div className="flex items-center gap-x-2">
                  <div className="">{iconMapping[infra.infra_name] || null}</div>
                  <Label htmlFor={infra._id} className="font-bold text-base">
                    {infra.infra_name}
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground font-normal mt-1">
                  {descriptionMapping[infra.infra_name] || "Description not available."}
                </p>
              </div>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  );
};

export default InfraTypeForm;
