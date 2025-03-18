"use client";

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  useToast,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [Occupation, setOccupation] = useState("");
  const [bp, setBp] = useState("");
  const [spo2, setSpo2] = useState("");
  const [pulserate, setPulserate] = useState("");
  const [temp, setTemp] = useState("");
  const [chiefcomp, setChiefcomp] = useState("");
  const [diabetes, setDiabetes] = useState("");
  const [hypertension, setHypertension] = useState("");
  const [hypothyroid, setHypothyroid] = useState("");
  const [cva, setCva] = useState("");
  const [cad, setCad] = useState("");
  const [pasthistory, setPasthistory] = useState("");
  const [anyother, setAnyother] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    // Concatenate the form data into a single string
    const patientInfo = `Name: ${name}\nAge: ${age}\nSex: ${sex}\nOccupation: ${Occupation}\nBP: ${bp}\nSpO2: ${spo2}\nPulse Rate: ${pulserate}\nTemperature: ${temp}\nChief Complaint: ${chiefcomp}\nDiabetes: ${diabetes}\nHypertension: ${hypertension}\nHypothyroid: ${hypothyroid}\nCVA: ${cva}\nCAD: ${cad}\nPast History: ${pasthistory}\nAny Other: ${anyother}`;

    try {
      console.log("Sending request with patient info:", patientInfo);

      const response = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientInfo }),
      });

      const data = await response.json();
      console.log("Received response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Classification failed");
      }

      if (data.classification) {
        setResult(data.classification);
      } else {
        throw new Error("No classification received");
      }
    } catch (error) {
      console.error("Error details:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to classify patient information",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md">
      <Box textAlign="center" borderTop="1px solid" borderBottom="1px solid" borderColor="gray.200" py={3}>
        <Text fontSize="sm" mb={3}>
          Created by{" "}
          <Box
            as="a"
            href="https://www.linkedin.com/in/fimilfaneea/"
            target="_blank"
            color="blue.500"
            fontWeight="bold"
            _hover={{ textDecoration: "underline" }}
          >
            Fimil
          </Box>
        </Text>
      </Box>

      <VStack spacing={6} align="stretch" mt={3}>
        <Heading textAlign="center">Emergency Triage Classification</Heading>
        <Text textAlign="center">Enter patient information below</Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Patient Name"
              size="lg"
              required
            />
            <Input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              size="lg"
              type="number"
              required
            />
            <Input
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              placeholder="Sex"
              size="lg"
              required
            />
            <Input
              value={Occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Occupation"
              required
            />
            <Input
              value={bp}
              onChange={(e) => setBp(e.target.value)}
              placeholder="Blood Pressure"
              size="lg"
            />
            <Input
              value={spo2}
              onChange={(e) => setSpo2(e.target.value)}
              placeholder="SpO2"
              size="lg"
            />
            <Input
              value={pulserate}
              onChange={(e) => setPulserate(e.target.value)}
              placeholder="Pulse Rate"
              size="lg"
            />
            <Input
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              placeholder="Temperature"
              size="lg"
            />
            <Textarea
              value={chiefcomp}
              onChange={(e) => setChiefcomp(e.target.value)}
              placeholder="Chief Complaint"
              size="lg"
            />
            <Input
              value={diabetes}
              onChange={(e) => setDiabetes(e.target.value)}
              placeholder="Diabetes (Yes/No)"
              size="lg"
            />
            <Input
              value={hypertension}
              onChange={(e) => setHypertension(e.target.value)}
              placeholder="Hypertension (Yes/No)"
              size="lg"
            />
            <Input
              value={hypothyroid}
              onChange={(e) => setHypothyroid(e.target.value)}
              placeholder="Hypothyroid (Yes/No)"
              size="lg"
            />
            <Input
              value={cva}
              onChange={(e) => setCva(e.target.value)}
              placeholder="CVA (Yes/No)"
              size="lg"
            />
            <Input
              value={cad}
              onChange={(e) => setCad(e.target.value)}
              placeholder="CAD (Yes/No)"
              size="lg"
            />
            <Input
              value={pasthistory}
              onChange={(e) => setPasthistory(e.target.value)}
              placeholder="Past Medical History"
              size="lg"
            />
            <Input
              value={anyother}
              onChange={(e) => setAnyother(e.target.value)}
              placeholder="Any Other Information"
              size="lg"
            />
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              loadingText="Classifying..."
              width="full"
            >
              Classify
            </Button>
          </VStack>
        </form>

        {result && (
          <Card
            width="100%"
            maxW="1000px"
            minH="150px"
            maxH="1000px"
            overflowY="auto"
          >
            <CardBody>
              <VStack align="start" spacing={4}>
                <Text fontWeight="bold">Triage Classification:</Text>
                <Text
                  fontSize="xl"
                  color={result.toLowerCase()}
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                >
                  {result}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
}
