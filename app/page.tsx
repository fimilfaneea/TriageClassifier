"use client";

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Textarea,
  Button,
  useToast,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Home() {
  const [patientInfo, setPatientInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

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
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading textAlign="center">Emergency Triage Classification</Heading>
        <Text textAlign="center">
          Enter patient information below to determine triage color code
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Textarea
              value={patientInfo}
              onChange={(e) => setPatientInfo(e.target.value)}
              placeholder="Enter patient symptoms, vital signs, and other relevant information..."
              size="lg"
              rows={6}
              required
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
            maxW="600px"
            minH="150px"
            maxH="400px"
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
