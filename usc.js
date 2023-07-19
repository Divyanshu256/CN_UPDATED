// Function to calculate classful subnetting
function calculateClassfulSubnet(ipAddress) {
    const octets = ipAddress.split(".");
    const firstOctet = parseInt(octets[0]);
  
    let networkAddress, subnetMask, subnetSize, usableHosts, broadcastAddress, ipRange;
  
    if (firstOctet >= 0 && firstOctet <= 127) {
      // Class A subnetting
      networkAddress = `${octets[0]}.0.0.0`;
      subnetMask = `255.0.0.0`;
      subnetSize = 8;
      usableHosts = Math.pow(2, 24) - 2;
      broadcastAddress = `${octets[0]}.255.255.255`;
      ipRange = `${octets[0]}.0.0.1 - ${octets[0]}.255.255.254`;
       document.getElementById("classful-subnet-mask-class").textContent ="class A";
    } else if (firstOctet >= 128 && firstOctet <= 191) {
      // Class B subnetting
      networkAddress = `${octets[0]}.${octets[1]}.0.0`;
      subnetMask = `255.255.0.0`;
      subnetSize = 16;
      usableHosts = Math.pow(2, 16) - 2;
      broadcastAddress = `${octets[0]}.${octets[1]}.255.255`;
      ipRange = `${octets[0]}.${octets[1]}.0.1 - ${octets[0]}.${octets[1]}.255.254`;
    } else if (firstOctet >= 192 && firstOctet <= 223) {
      // Class C subnetting
      networkAddress = `${octets[0]}.${octets[1]}.${octets[2]}.0`;
      subnetMask = `255.255.255.0`;
      subnetSize = 24;
      usableHosts = Math.pow(2, 8) - 2;
      broadcastAddress = `${octets[0]}.${octets[1]}.${octets[2]}.255`;
      ipRange = `${octets[0]}.${octets[1]}.${octets[2]}.1 - ${octets[0]}.${octets[1]}.${octets[2]}.254`;
    } else {
      // Invalid IP address
      networkAddress = "N/A";
      subnetMask = "N/A";
      subnetSize = "N/A";
      usableHosts = "N/A";
      broadcastAddress = "N/A";
      ipRange = "N/A";
    }
  
    return {
      networkAddress,
      subnetMask,
      subnetSize,
      usableHosts,
      broadcastAddress,
      subnetClass: getSubnetClass(ipAddress),
      ipRange
    };
  }
  
  // Function to calculate classless subnetting
  function calculateClasslessSubnet(ipAddress, subnetMask) {
    const octetsIP = ipAddress.split(".");
    const octetsSubnet = subnetMask.split(".");
  
    let networkAddress = "";
    let subnetMaskBinary = "";
    let subnetSize = 0;
  
    for (let i = 0; i < 4; i++) {
      const octetIP = parseInt(octetsIP[i]);
      const octetSubnet = parseInt(octetsSubnet[i]);
  
      if (isNaN(octetIP) || isNaN(octetSubnet) || octetIP < 0 || octetSubnet < 0 || octetIP > 255 || octetSubnet > 255) {
        // Invalid IP address or subnet mask
        return {
          networkAddress: "N/A",
          subnetMaskBinary: "N/A",
          subnetSize: "N/A",
          usableHosts: "N/A",
          broadcastAddress: "N/A",
          ipRange: "N/A"
        };
      }
  
      networkAddress += (octetIP & octetSubnet).toString() + ".";
      subnetMaskBinary += octetToBinaryString(octetSubnet) + ".";
      subnetSize += countSetBits(octetSubnet);
    }
  
    networkAddress = networkAddress.slice(0, -1);
    subnetMaskBinary = subnetMaskBinary.slice(0, -1);
    subnetSize = subnetSize.toString();
  
    const usableHosts = Math.pow(2, 32 - subnetSize) - 2;
    const broadcastAddress = calculateBroadcastAddress(networkAddress, subnetMaskBinary);
    const ipRange = calculateIPRange(networkAddress, broadcastAddress);
  
    return {
      networkAddress,
      subnetMaskBinary,
      subnetSize,
      usableHosts,
      broadcastAddress,
      ipRange
    };
  }
  
  // Function to calculate the broadcast address based on network address and subnet mask
  function calculateBroadcastAddress(networkAddress, subnetMaskBinary) {
    const networkOctets = networkAddress.split(".");
    const subnetOctets = subnetMaskBinary.split(".");
  
    let broadcastAddress = "";
  
    for (let i = 0; i < 4; i++) {
      const networkOctet = parseInt(networkOctets[i], 2);
      const subnetOctet = parseInt(subnetOctets[i], 2);
  
      const broadcastOctet = networkOctet | (~subnetOctet & 0xFF);
      broadcastAddress += broadcastOctet.toString() + ".";
    }
  
    broadcastAddress = broadcastAddress.slice(0, -1);
  
    return broadcastAddress;
  }
  
  // Function to calculate the IP range based on network address and broadcast address
  function calculateIPRange(networkAddress, broadcastAddress) {
    const startIP = incrementIPAddress(networkAddress);
    const endIP = decrementIPAddress(broadcastAddress);
  
    return `${startIP} - ${endIP}`;
  }
  
  // Function to increment the IP address by 1
  function incrementIPAddress(ipAddress) {
    const octets = ipAddress.split(".");
  
    let carry = 1;
    for (let i = 3; i >= 0; i--) {
      let octet = parseInt(octets[i]);
      octet += carry;
  
      if (octet > 255) {
        octet = 0;
        carry = 1;
      } else {
        carry = 0;
      }
  
      octets[i] = octet.toString();
    }
  
    return octets.join(".");
  }
  
  // Function to decrement the IP address by 1
  function decrementIPAddress(ipAddress) {
    const octets = ipAddress.split(".");
  
    let carry = 1;
    for (let i = 3; i >= 0; i--) {
      let octet = parseInt(octets[i]);
      octet -= carry;
  
      if (octet < 0) {
        octet = 255;
        carry = 1;
      } else {
        carry = 0;
      }
  
      octets[i] = octet.toString();
    }
  
    return octets.join(".");
  }
  
  // Function to convert an octet to a binary string
  function octetToBinaryString(octet) {
    return ("00000000" + octet.toString(2)).slice(-8);
  }
  
  // Function to count the number of set bits (1s) in an octet
  function countSetBits(octet) {
    let count = 0;
  
    while (octet > 0) {
      count += octet & 1;
      octet >>= 1;
    }
  
    return count;
  }
  // Function to handle form submission
  function handleSubmit(event) {
    event.preventDefault();
  
    const ipAddress = document.getElementById("ip-address").value;
    const subnetMask = document.getElementById("subnet-mask").value;
    const classfulCheckbox = document.getElementById("classful-checkbox");
    const classlessCheckbox = document.getElementById("classless-checkbox");
  
    let classfulResults = null;
    let classlessResults = null;
  
    if (classfulCheckbox.checked) {
      classfulResults = calculateClassfulSubnet(ipAddress);
    }
  
    if (classlessCheckbox.checked) {
      classlessResults = calculateClasslessSubnet(ipAddress, subnetMask);
    }
  
    displayResults(classfulResults, classlessResults);
  }
  // Function to determine the class of the subnet
function getSubnetClass(ipAddress) {
    const firstOctet = parseInt(ipAddress.split(".")[0]);
  
    if (firstOctet >= 1 && firstOctet <= 126) {
      return "Class A";
    } else if (firstOctet >= 128 && firstOctet <= 191) {
      return "Class B";
    } else if (firstOctet >= 192 && firstOctet <= 223) {
      return "Class C";
    } else if (firstOctet >= 224 && firstOctet <= 239) {
      return "Class D (Multicast)";
    } else if (firstOctet >= 240 && firstOctet <= 255) {
      return "Class E (Reserved)";
    } else {
      return "Invalid IP Address";
    }
  }
  // Function to display the results
  function displayResults(classfulResults, classlessResults) {
    const resultsElement = document.getElementById("results");
    resultsElement.classList.remove("hidden");
  
    const classfulResultsElement = document.getElementById("classful-results");
    const classlessResultsElement = document.getElementById("classless-results");
  
    if (classfulResults) {
      classfulResultsElement.classList.remove("hidden");
      document.getElementById("classful-network-address").textContent = `Network Address: ${classfulResults.networkAddress}`;
      document.getElementById("classful-subnet-mask").textContent = `Subnet Mask: ${classfulResults.subnetMask}`;
      document.getElementById("classful-subnet-size").textContent = `Subnet Size: /${classfulResults.subnetSize}`;
      document.getElementById("classful-usable-hosts").textContent = `Usable Hosts: ${classfulResults.usableHosts}`;
      document.getElementById("classful-broadcast-address").textContent = `Broadcast Address: ${classfulResults.broadcastAddress}`;
      document.getElementById("classful-ip-range").textContent = `IP Range: ${classfulResults.ipRange}`;
      document.getElementById("classful-subnet-mask").textContent = `Subnet Mask: ${classfulResults.subnetMask}`;
      document.getElementById("classful-subnet-mask-class").textContent = `Subnet Mask Class: ${classfulResults.getSubnetClass}`; // Display subnet mask class
    } else {
      classfulResultsElement.classList.add("hidden");
    }
  
    if (classlessResults) {
      classlessResultsElement.classList.remove("hidden");
      document.getElementById("classless-network-address").textContent = `Network Address: ${classlessResults.networkAddress}`;
      document.getElementById("classless-subnet-mask-binary").textContent = `Subnet Mask (Binary): ${classlessResults.subnetMaskBinary}`;
      document.getElementById("classless-subnet-size").textContent = `Subnet Size: /${classlessResults.subnetSize}`;
      document.getElementById("classless-usable-hosts").textContent = `Usable Hosts: ${classlessResults.usableHosts}`;
      document.getElementById("classless-broadcast-address").textContent = `Broadcast Address: ${classlessResults.broadcastAddress}`;
      document.getElementById("classless-ip-range").textContent = `IP Range: ${classlessResults.ipRange}`;
    } else {
      classlessResultsElement.classList.add("hidden");
    }
  }
  // Event listener for form submission
  document.getElementById("subnet-form").addEventListener("submit", handleSubmit);
