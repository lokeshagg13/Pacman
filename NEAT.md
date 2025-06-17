# NEAT (NeuroEvolution of Augmenting Topologies)

The **NEAT** (NeuroEvolution of Augmenting Topologies) algorithm is an evolutionary algorithm used to optimize neural networks. It evolves both the weights and the topology of a neural network to solve a given task. Here's a breakdown of the NEAT algorithm and the configuration file you provided:

---

## **NEAT Algorithm**

1. **Initial Population**:

   - Starts with a population of simple neural networks (minimal topology).
   - Networks typically have input and output nodes connected by random weights.

2. **Fitness Evaluation**:

   - Each neural network is tested on a task, and a fitness score is calculated based on performance.

3. **Speciation**:

   - Networks are grouped into species based on their structural similarity (genes and weights).
   - This preserves innovation, as new structures are protected from direct competition with existing ones.

4. **Crossover and Mutation**:

   - **Crossover**: Combines parts of two parent networks to produce offspring.
   - **Mutation**: Alters networks by:

     - Adding new nodes or connections.
     - Perturbing weights.
     - Reinitializing weights.

5. **Survival and Evolution**:

   - Networks with the highest fitness scores are selected to survive and reproduce.
   - Evolution continues for a set number of generations or until a target fitness is achieved.

6. **Topology Growth**:

   - NEAT incrementally grows the network topology by adding nodes and connections over generations, ensuring gradual complexity.

---

## **NEAT Configuration File Breakdown**

This file customizes the NEAT algorithm's behavior. Here's an explanation of each section:

### **Basic Network Structure**

- `inputSize`: Number of input nodes (e.g., for XOR, there are 2 inputs).
- `outputSize`: Number of output nodes (e.g., for XOR, there is 1 output).
- `activationFunction`: Function applied to neuron outputs (e.g., `'Sigmoid'`).

### **Bias Settings**

- `bias`: The default bias value used in computations.
- `connectBias`: Automatically connects a bias node to all output nodes during network construction.
- `biasMode`: Determines how biases are implemented (`WEIGHTED_NODE` implies a separate node for bias).

<div style="background: wheat; color: black; padding: 5px;">

### **Bias in Neural Networks**

Bias in neural networks is a scalar value added to the input of an activation function. It enables the model to better fit the data by shifting the activation function along the input axis. This allows the neural network to learn patterns that do not pass through the origin, improving flexibility and performance.

#### **Role of Bias in Neural Networks**

1. **Shifting Activation Functions**:

   - Without bias, the activation function's output is strictly determined by the weighted sum of inputs.
   - Bias allows the network to adjust and shift the activation curve (e.g., Sigmoid, ReLU) to account for patterns that do not align with the origin.

2. **Improved Learning**:

   - For instance, in a linear function $y = wx + b$, $b$ is the bias. It shifts the function up or down, enabling the network to model data points that do not start at $y = 0$ when $x = 0$.

---

### **Connecting Bias Node to All Output Nodes**

When a **bias node** is connected to all output nodes during network construction:

- **Bias Node**:

  - A dedicated node with a fixed output value, usually $1$.
  - Does not depend on any input; it's constant and independent.

- **Connection**:

  - Each output node receives a bias value weighted by a learnable weight.
  - During training, these weights are adjusted along with other network weights.

- **Impact**:

  - Adds a degree of freedom for the network, allowing it to adjust the activation level of each output independently.
  - This improves the network's ability to approximate complex functions.

#### **Example**:

Consider a single-layer perceptron:
$Output = Activation(\sum_{i} (w_i \cdot x_i) + bias)$

Without bias:

- The output strictly depends on weighted inputs. If all inputs are zero, the output is zero.

With bias:

- Even if inputs are zero, the bias shifts the activation function to produce a non-zero output.

---

### **BiasMode: WEIGHTED_NODE**

The `biasMode` specifies how the bias is implemented in the network. In the case of `WEIGHTED_NODE`:

1. **Bias Node as a Network Node**:

   - The bias is treated as a distinct node in the network.
   - It has an output of 1 and is connected to relevant nodes in the network via weighted connections.

2. **Weighted Connections**:

   - The bias node's connections have weights that are adjustable during training.
   - These weights determine the influence of the bias node on the connected output nodes.

#### **Comparison to Other Modes**:

- **Static Bias**:

  - A fixed scalar value added directly to the activation function without any connection or weight adjustment.
  - Less flexible since it doesn't adapt during training.

- **WEIGHTED_NODE**:

  - Offers more adaptability because the weights connecting the bias node to other nodes are optimized.
  - This allows the network to tune how much the bias affects each connected node.

#### **Why Use WEIGHTED_NODE?**

- It ensures a dynamic and learnable bias influence.
- Especially useful in complex architectures, where different nodes may require varying levels of bias influence.

---

### **Practical Example**

Imagine a network predicting house prices:

- Inputs: Size, location, number of rooms.
- Output: Predicted price.

Without bias:

- The model assumes the price is zero when all features are zero, which may not be realistic.

With a bias node:

- The bias shifts predictions, allowing the model to account for a base price that isn't dependent on specific features.

Using `WEIGHTED_NODE`:

- The base price (bias) is dynamically adjusted through learnable weights, helping the model adapt to varying datasets and improve accuracy.

</div>

### **Fitness Function**

- `fitnessFunction`: Specifies the task to evaluate fitness (e.g., `'XOR'`).

### **Weight Initialization**

- Defines how initial weights are assigned.
- `type`: `'Random'` initializes weights randomly.
- `params`: Specifies the range of weights (e.g., between `-1` and `1`).

### **Network Topology Parameters**

- `c1`, `c2`, `c3`: Coefficients for comparing genetic distance (excess genes, disjoint genes, weight differences).
- `compatibilityThreshold`: Maximum genetic distance within a species.
- `interspeciesMatingRate`: Rate of reproduction across species.

<div style="background: wheat; color: black; padding: 5px">

### **Detailed Explanation of Network Topology Parameters in NEAT**

These parameters govern how neural networks in the NEAT algorithm are compared, grouped into species, and evolve through crossover and mutation.

---

### 1. **Coefficients for Comparing Genetic Distance**

These coefficients (`c1`, `c2`, `c3`) determine how genetic distance is calculated between two networks. Genetic distance is a measure of how different two neural networks are, considering their structure and weights.

#### Components of Genetic Distance:

Genetic distance $D$ is calculated using the formula:

$$
D = \frac{c1 \cdot E}{N} + \frac{c2 \cdot D}{N} + c3 \cdot W
$$

Where:

- $E$: Number of **excess genes** (genes in one network but not the other, beyond the matching genes).
- $D$: Number of **disjoint genes** (genes that exist in one network but not in the other, within the overlapping range of genes).
- $W$: **Weight differences**: Average difference in weights for matching genes (genes that exist in both networks).
- $N$: Normalization factor, usually the number of genes in the larger network (to ensure fairness across networks of varying sizes).

<hr style="background: black" />

#### Example to understand Excess and Disjoint genes

##### **Networks Given**

- **Network 1**: $1, 2, 3, 6, 7, 8, 9$
- **Network 2**: $1, 2, 4, 5, 7$

##### **Step 1: Identify Aligned Genes**

Aligned genes are those that exist in both networks **with matching innovation numbers**.

- Aligned genes: $1, 2, 7$

##### **Step 2: Identify Disjoint Genes**

Disjoint genes are genes that exist **in one network but not in the other**, and they occur **within the range of aligned genes** (from the smallest aligned innovation number to the largest aligned innovation number).

- **Range of aligned genes**: Innovation numbers 1 to 7.

- **Disjoint genes in Network 1**:

  - $3$: Exists in Network 1 but not in Network 2.
  - $6$: Exists in Network 1 but not in Network 2.

- **Disjoint genes in Network 2**:

  - $4$: Exists in Network 2 but not in Network 1.
  - $5$: Exists in Network 2 but not in Network 1.

- **Disjoint genes summary**:

  - From Network 1: $3, 6$
  - From Network 2: $4, 5$

##### **Step 3: Identify Excess Genes**

Excess genes are genes that exist **in one network but not in the other**, and they occur **outside the range of aligned genes** (beyond the largest aligned innovation number).

- **Largest aligned gene**: $7$.

- **Excess genes in Network 1**:

  - $8$: Exists beyond $7$.
  - $9$: Exists beyond $7$.

- **Excess genes in Network 2**:

  - None (Network 2 has no genes beyond $7$).

- **Excess genes summary**:

  - From Network 1: $8, 9$
  - From Network 2: None.

##### **Final Answer**

- **Aligned genes**: $1, 2, 7$
- **Disjoint genes**:

  - From Network 1: $3, 6$
  - From Network 2: $4, 5$

- **Excess genes**:

  - From Network 1: $8, 9$
  - From Network 2: None.

<hr style="background: black" />

#### Coefficients:

- **`c1` (Excess Genes Coefficient)**:

  - Determines the importance of **excess genes** in calculating genetic distance.
  - Higher `c1` values penalize large differences in network size.

- **`c2` (Disjoint Genes Coefficient)**:

  - Determines the importance of **disjoint genes**.
  - A higher value means networks with disjointed topologies are considered more genetically distant.

- **`c3` (Weight Differences Coefficient)**:

  - Weighs the difference in connection weights for matching genes.
  - Larger values of `c3` emphasize the similarity or divergence in network weights over structure.

#### Impact:

- High values of `c1` or `c2` favor small, minimal networks.
- High `c3` values focus more on weight optimization than structural changes.

---

### 2. **`compatibilityThreshold`: Maximum Genetic Distance Within a Species**

The **compatibility threshold** determines the maximum genetic distance two networks can have to be considered part of the same species.

#### Functionality:

- Networks are grouped into **species** based on their genetic distance.
- If the distance $D$ between two networks is less than or equal to `compatibilityThreshold`, they belong to the same species.

#### Purpose:

- Encourages diversity by allowing networks with similar topologies to compete within the same species, rather than directly with the entire population.
- Protects innovative networks (e.g., a new structure) from being prematurely eliminated by allowing them to compete in their niche.

#### Tunable Impact:

- A **low `compatibilityThreshold`**:

  - Results in more species with fewer networks in each.
  - Protects diversity but can slow convergence due to fewer cross-species interactions.

- A **high `compatibilityThreshold`**:

  - Fewer species, larger groups, more competition within each species.
  - Faster convergence but risks losing diversity.

---

### 3. **`interspeciesMatingRate`: Rate of Reproduction Across Species**

The **interspecies mating rate** determines how often two parents from different species mate to produce offspring.

#### Functionality:

- During reproduction, most pairings occur **within the same species**.
- Occasionally, parents from different species are selected for crossover based on `interspeciesMatingRate`.

#### Purpose:

- Ensures cross-species genetic mixing, which can:

  - Introduce beneficial traits from one species to another.
  - Maintain diversity in the population.

#### Tunable Impact:

- **Low `interspeciesMatingRate`**:

  - Reduces genetic mixing between species, leading to more specialized evolution within each species.
  - May risk stagnation if a species becomes isolated from beneficial traits in other species.

- **High `interspeciesMatingRate`**:

  - Promotes diversity and can help share beneficial mutations across species.
  - May dilute species specialization, slowing progress for specific niches.

---

### **Summary Table**

| Parameter                | Purpose                                                                                        | Tunable Effect                                                                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `c1`                     | Coefficient for **excess genes**. Penalizes differences in network size.                       | Higher values discourage large networks and emphasize topological simplicity.                                                   |
| `c2`                     | Coefficient for **disjoint genes**. Penalizes mismatched connections within overlapping range. | Higher values encourage similarity in the structure of overlapping networks.                                                    |
| `c3`                     | Coefficient for **weight differences**. Penalizes differences in matching weights.             | Higher values emphasize optimization of weights over structure.                                                                 |
| `compatibilityThreshold` | Maximum genetic distance to classify networks into the same species.                           | Lower values increase the number of species and protect diversity; higher values lead to fewer species with faster convergence. |
| `interspeciesMatingRate` | Probability of crossover between networks from different species.                              | Higher values promote diversity by sharing traits across species; lower values encourage specialization.                        |

---

### **Practical Considerations**

1. **Balancing Diversity and Convergence**:

   - Adjusting these parameters involves trade-offs between preserving innovation (diversity) and achieving solutions quickly (convergence).

2. **Task-Specific Tuning**:

   - Tasks requiring complex networks may need higher `c1` and `c2` values to reward structural changes.
   - Tasks focusing on weight optimization (e.g., regression) may benefit from a higher `c3`.

3. **Default Values**:

   - Start with moderate values for `c1`, `c2`, `c3`, and `compatibilityThreshold`.
   - Tune based on observed species diversity and population performance over generations.

</div>

### **Mutation Parameters**

- Control how networks mutate:

  - `mutationRate`: Overall mutation chance.
  - `weightMutationRate`: Chance for weight mutations.
  - `addConnectionMutationRate`: Chance to add new connections.
  - `addNodeMutationRate`: Chance to add new nodes.
  - `minWeight`, `maxWeight`: Range for weights.
  - `reinitializeWeightRate`: Chance to completely reset a weight.
  - `minPerturb`, `maxPerturb`: Range for perturbing weights.

<div style="background: wheat; color: black; padding: 5px;">

Weight perturbation refers to the small random changes applied to the weights of connections in a neural network during training or evolution. It is commonly used in evolutionary algorithms like NEAT to explore new solutions without drastically altering the network's structure.

</div>

### **Evolution Parameters**

- Control the evolutionary process:

  - `populationSize`: Number of networks in each generation.
  - `generations`: Number of generations to evolve.
  - `targetFitness`: Desired fitness score.
  - `survivalRate`: Fraction of the population that survives each generation.
  - `numOfElite`: The number of top-performing individuals (elites) preserved unchanged for the next generation. Elites are part of the surviving fraction but are explicitly preserved without modification.
  - `dropOffAge`: The maximum age (number of generations) a network can survive without improving before it is considered obsolete and removed.
  - `populationStagnationLimit`: Limit for no improvement before reset.
  - `keepDisabledOnCrossOverRate`: Chance to retain disabled connections during crossover.
  - `mutateOnlyProb`: Probability of mutation-only reproduction.

<hr style="background: black;">

<div style="background: wheat; color: black; padding: 5px;">


---

### 1. **`survivalRate`**

* **Definition**: Fraction of the population that survives each generation during natural selection.
* **Purpose**:

  * Determines how many individuals are kept from one generation to the next based on their fitness.
  * Ensures that only the fittest networks persist while weaker ones are removed.
* **Example**:

  * If the population size is 100 and the survival rate is 0.2, only 20 individuals (20%) survive to the next generation.
  * These survivors form the base for reproduction and mutation in the next generation.

---

### 2. **`numOfElite`**

* **Definition**: The number of top-performing individuals (elites) preserved unchanged for the next generation.
* **Purpose**:

  * Protects the best solutions found so far from being lost due to crossover or mutation.
  * Ensures that high-quality solutions are not degraded.
* **Example**:

  * If `numOfElite` is 5, the top 5 individuals based on fitness are directly passed to the next generation without alteration.
* **Relation to `survivalRate`**:

  * Elites are part of the surviving fraction but are explicitly preserved without modification.

---

### 3. **`dropOffAge`**

* **Definition**: The maximum age (number of generations) a network can survive without improving before it is considered obsolete and removed.
* **Purpose**:

  * Prevents outdated or stagnant solutions from dominating the population.
  * Encourages exploration of new solutions by removing stale networks.
* **Example**:

  * If `dropOffAge` is 15 and a network hasn’t improved for 15 generations, it is removed even if it initially had good fitness.

---

### 4. **`populationStagnationLimit`**

* **Definition**: The number of generations allowed without significant improvement in overall population fitness before a reset occurs.
* **Purpose**:

  * Addresses global stagnation by resetting the population to encourage diversity and exploration.
  * Helps avoid getting stuck in local optima.
* **Example**:

  * If `populationStagnationLimit` is 20, and no fitness improvement is observed for 20 generations, the algorithm resets part or all of the population to new random individuals.

---

### 5. **`keepDisabledOnCrossOverRate`**

* **Definition**: The probability of keeping a connection disabled during the crossover if it is disabled in one or both parent networks.
* **Purpose**:

  * Maintains the functionality of disabled connections, which might play a role later when re-enabled.
  * Helps preserve network topology by avoiding premature or unnecessary activation of connections.
* **Example**:

  * If a connection is disabled in one parent and `keepDisabledOnCrossOverRate` is 0.75, there’s a 75% chance it will remain disabled in the offspring.

---

### 6. **`mutateOnlyProb`**

* **Definition**: The probability that an individual undergoes only mutation (without crossover) during reproduction.
* **Purpose**:

  * Promotes exploration by creating entirely new variations of existing networks.
  * Balances exploitation (crossover of good solutions) and exploration (mutation-only to search new areas).
* **Example**:

  * If `mutateOnlyProb` is 0.25, there is a 25% chance that a child will be created solely through mutation rather than combining genes from two parents.

---

### **Summary Table**

| **Parameter**                 | **Definition**                                                              | **Purpose**                                                     | **Impact**                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `survivalRate`                | Fraction of population that survives each generation.                       | Ensures only the fittest survive for reproduction.              | Controls selection pressure; higher value retains more individuals, lower value promotes elitism. |
| `numOfElite`                  | Number of top individuals preserved unchanged.                              | Protects best solutions from degradation.                       | Retains high-performing individuals, balancing exploration and exploitation.                      |
| `dropOffAge`                  | Maximum age before a network is removed due to stagnation.                  | Prevents stale networks from persisting.                        | Encourages dynamic exploration and avoids stagnation.                                             |
| `populationStagnationLimit`   | Generations allowed without improvement before population reset.            | Prevents global stagnation and promotes exploration.            | Ensures diversity and exploration in the population.                                              |
| `keepDisabledOnCrossOverRate` | Chance to retain disabled connections during crossover.                     | Preserves useful inactive connections for potential future use. | Maintains topological integrity and prevents unnecessary activation.                              |
| `mutateOnlyProb`              | Probability of creating offspring through mutation-only, without crossover. | Encourages exploration of novel solutions.                      | Balances between exploiting current best solutions and exploring new possibilities.               |

These parameters work together to control how the NEAT algorithm evolves populations, balancing **exploitation** (using the best current solutions) and **exploration** (finding new, potentially better solutions).

</div>

<hr style="background: black;">


### **Recurrent Network Options**

- `allowRecurrentConnections`: Enables recurrent connections for feedback loops.
- `recurrentConnectionRate`: Controls the likelihood of recurrent connections.

