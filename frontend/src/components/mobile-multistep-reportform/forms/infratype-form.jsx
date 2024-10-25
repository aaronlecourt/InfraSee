import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Zap, Droplet, Car, Wifi, Building } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

const InfraTypeForm = ({ infraType, setInfraType }) => {
  const [infrastructureTypes, setInfrastructureTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setValue } = useFormContext();

  const iconMapping = {
    "Power and Energy": <Zap size={20} className='text-muted-foreground' />,
    "Water and Waste": <Droplet size={20} className='text-muted-foreground' />,
    "Transportation": <Car size={20} className='text-muted-foreground' />,
    "Telecommunications": <Wifi size={20} className='text-muted-foreground' />,
    "Commercial": <Building size={20} className='text-muted-foreground' />,
  };

  const descriptionMapping = {
    "Power and Energy": "For reports on broken power infrastructure—such as electrical posts, live wires, transformers, and more—service disconnections for non-payment are excluded.",
    "Water and Waste": "For reports on broken water or waste infrastructure, including pipes, canals, pumps, and more—service disconnections for non-payment are excluded.",
    "Transportation": "For reports on broken transportation infrastructure—such as damaged roads, traffic signals, brigdes, and more.",
    "Telecommunications": "For reports on broken telecommunications infrastructure—such as downed cables, cell towers, and network outages—service disconnections for non-payment are excluded.",
    "Commercial": "For reports on damaged or broken commercial infrastructure—such as retail spaces, parking lots, office buildings, and more.",
  };

  useEffect(() => {
    const fetchInfrastructureTypes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/infrastructure-types");
        const data = await response.json();
        setInfrastructureTypes(data);
      } catch (error) {
        console.error("Error fetching infrastructure types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfrastructureTypes();
  }, []);

  const handleValueChange = (value) => {
    setInfraType(value);
    setValue("infraType", value);
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <RadioGroup value={infraType} onValueChange={handleValueChange}>
          <div className="flex flex-row sm:flex-wrap gap-4 overflow-x-auto">
            {infrastructureTypes.map((infra) => (
              <div
                key={infra._id}
                className={`flex flex-col justify-top p-4 border rounded-lg cursor-pointer min-w-56 sm:mb-0 mb-2 text-wrap transition ${
                  infraType === infra._id ? "border-gray-300 bg-gray-100" : "border"
                } max-w-[250px] min-h-[100px]`}
                onClick={() => handleValueChange(infra._id)}
              >
                <RadioGroupItem value={infra._id} id={infra._id} className="hidden" />
                <div className="flex items-center gap-x-2">
                  <div>{iconMapping[infra.infra_name] || null}</div>
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
