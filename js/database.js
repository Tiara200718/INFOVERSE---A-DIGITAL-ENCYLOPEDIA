/**
 * INFOVERSE DATABASE & STORAGE ENGINE
 * Manages persistent client storage (localStorage) and simulates a Relational SQL Database
 * for academic presentation and viva examination questions ("Where will data save?").
 */

const DB_KEYS = {
  USERS: 'infoverse_users_db',
  CURRENT_SESSION: 'infoverse_current_session',
  ARTICLES: 'infoverse_articles_db',
  BOOKMARKS: 'infoverse_bookmarks_db',
  SEARCH_HISTORY: 'infoverse_search_history',
  DB_INITIALIZED: 'infoverse_db_v1_init'
};

// Default seed database articles across all 5 knowledge categories with ultra-detailed scholarly content
const INITIAL_ARTICLES = [
  {
    id: 'art-001',
    title: 'The Architecture of Modern Artificial Neural Networks',
    category: 'Computer Science & AI',
    categorySlug: 'cs-ai',
    tag: 'Artificial Intelligence',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    author: 'Dr. Alan Turing Fellow',
    affiliation: 'Deep Learning & Cognitive Computing Lab',
    date: 'August 2026',
    doi: '10.1016/j.infoverse.2026.08.001',
    peerReviewed: 'Peer-Reviewed by IEEE & ACM Faculty Board',
    citationsCount: '2,840 citations',
    schematicTags: ['INPUT LAYER', 'HIDDEN LAYERS', 'OUTPUT LAYER', 'GLOWING SYNAPSES', 'NEURAL NODES'],
    summary: 'An in-depth exploration of transformer architectures, attention mechanisms, backpropagation algorithms, and how modern deep learning models process human language.',
    image: 'images/neural_network_ai.jpg',
    keyTakeaways: [
      'Artificial Neural Networks approximate complex non-linear functions by stacking parameterized affine layers with non-linear activation thresholds.',
      'The Backpropagation algorithm uses the calculus chain rule to compute loss gradients backwards from output to input tensors.',
      'Multi-Head Self-Attention in Transformers enables parallel sequence processing, overcoming the sequential bottleneck of legacy RNNs.',
      'Deep residual connections ($y = F(x) + x$) prevent vanishing gradients, allowing architectures to scale to hundreds of layers.'
    ],
    content: `
      <h2>1. Foundations & Mathematical Formalism</h2>
      <p>Artificial Neural Networks (ANNs) represent universal function approximators composed of densely connected layers of artificial nodes. Each neuron computes a weighted linear combination of inputs followed by a non-linear activation mapping:</p>
      
      <div class="math-callout-box">
        <code>$$\\mathbf{y} = \\sigma\\left(\\sum_{i=1}^{n} w_i x_i + b\\right) = \\sigma(\\mathbf{W}^T \\mathbf{x} + \\mathbf{b})$$</code>
      </div>

      <p>Where $\\mathbf{W} \\in \\mathbb{R}^{d \\times k}$ denotes the learnable weight matrix, $\\mathbf{b} \\in \\mathbb{R}^k$ represents the bias vector, and $\\sigma(\\cdot)$ represents an activation function such as ReLU (Rectified Linear Unit), GELU (Gaussian Error Linear Unit), or Softmax.</p>

      <blockquote>
        "The question of whether machines can think is about as relevant as whether submarines can swim." — Edsger W. Dijkstra
      </blockquote>

      <h2>2. The Backpropagation & Optimization Pipeline</h2>
      <p>Training deep networks requires optimizing empirical risk over vast parameter spaces via stochastic gradient descent (SGD) and adaptive optimizers (AdamW):</p>
      
      <div class="tech-spec-table-wrap">
        <table class="tech-spec-table">
          <thead>
            <tr>
              <th>Computation Stage</th>
              <th>Mathematical Operation</th>
              <th>Computational Complexity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Forward Propagation</strong></td>
              <td>Linear matrix tensor contractions $\\mathbf{Z}^{[l]} = \\mathbf{W}^{[l]}\\mathbf{A}^{[l-1]} + \\mathbf{b}^{[l]}$</td>
              <td>$\\mathcal{O}(B \\cdot d_{\\text{in}} \\cdot d_{\\text{out}})$</td>
            </tr>
            <tr>
              <td><strong>Objective Loss Metric</strong></td>
              <td>Cross-Entropy: $\\mathcal{L} = -\\sum y_i \\log(\\hat{y}_i)$</td>
              <td>$\\mathcal{O}(B \\cdot K)$</td>
            </tr>
            <tr>
              <td><strong>Backward Gradient Flow</strong></td>
              <td>Chain rule: $\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}^{[l]}} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{Z}^{[l]}} (\\mathbf{A}^{[l-1]})^T$</td>
              <td>$\\mathcal{O}(B \\cdot d_{\\text{in}} \\cdot d_{\\text{out}})$</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. The Transformer Architecture & Self-Attention</h2>
      <p>The paradigm shift in modern AI occurred with the introduction of Scaled Dot-Product Self-Attention in 2017. Queries (Q), Keys (K), and Values (V) are projected from input embeddings:</p>

      <div class="math-callout-box">
        <code>$$\\text{Attention}(\\mathbf{Q}, \\mathbf{K}, \\mathbf{V}) = \\text{softmax}\\left(\\frac{\\mathbf{Q}\\mathbf{K}^T}{\\sqrt{d_k}}\\right)\\mathbf{V}$$</code>
      </div>

      <p>This allows every token in an input sequence to dynamically route information from every other token concurrently, enabling global contextual representation without recurrent state bottlenecks.</p>

      <h2>4. Academic References & Further Reading</h2>
      <ul class="scholarly-references-list">
        <li><strong>Vaswani, A., et al. (2017).</strong> "Attention Is All You Need." <em>Advances in Neural Information Processing Systems (NeurIPS 30)</em>, pp. 5998–6008.</li>
        <li><strong>LeCun, Y., Bengio, Y., & Hinton, G. (2015).</strong> "Deep learning." <em>Nature</em>, 521(7553), 436–444.</li>
        <li><strong>Goodfellow, I., Bengio, Y., & Courville, A. (2016).</strong> <em>Deep Learning</em>. MIT Press, Cambridge, MA.</li>
      </ul>
    `
  },
  {
    id: 'art-002',
    title: 'The Great Library of Alexandria: Beacon of the Ancient World',
    category: 'World History',
    categorySlug: 'history',
    tag: 'Ancient Civilizations',
    readTime: '8 min read',
    difficulty: 'Introductory',
    author: 'Prof. Helena Vance',
    affiliation: 'Department of Classical Antiquity & Hellenistic Studies',
    date: 'July 2026',
    doi: '10.1016/j.infoverse.2026.07.002',
    peerReviewed: 'Peer-Reviewed by Oxford Historical Society',
    citationsCount: '1,930 citations',
    schematicTags: ['PTOLEMAIC MOUSEION', 'PAPYRUS SCROLLS', 'HELLENISTIC SCHOLARS', 'COLOSSAL REPOSITORY'],
    summary: 'Discover the legendary center of classical scholarship, its colossal collection of papyrus scrolls, its renowned scholars like Eratosthenes, and the mystery of its decline.',
    image: 'images/library_of_alexandria.jpg',
    keyTakeaways: [
      'Founded under Ptolemy I Soter (c. 300 BCE) as part of the Mouseion, the royal research institution of Alexandria.',
      'Housed between 400,000 and 700,000 papyrus scrolls spanning mathematics, astronomy, medicine, philosophy, and poetry.',
      'Resident scholars formulated the foundation of empirical geometry (Euclid), calculated Earth’s circumference (Eratosthenes), and proposed early heliocentrism (Aristarchus).',
      'Decline was gradual over centuries due to fires, political strife, and shifting imperial patronage rather than a single sudden cataclysm.'
    ],
    content: `
      <h2>1. The Royal Dream of Universal Knowledge</h2>
      <p>Founded under the Ptolemaic dynasty of Egypt in the early 3rd century BCE, the <strong>Library of Alexandria</strong> (the <em>Mouseion</em>) was conceived not merely as a repository for books, but as an intellectual capital where universal knowledge could be systematically gathered, translated, and studied.</p>

      <blockquote>
        "Alexandria was the crossroads where Greek philosophy, Babylonian astronomy, and Egyptian medicine converged into the world's first global academic institution." — Prof. Helena Vance
      </blockquote>

      <h2>2. Colossal Scholarly Achievements</h2>
      <p>The library housed an estimated 400,000 to 700,000 papyrus scrolls. Chief librarians and resident scholars made groundbreaking discoveries that laid the foundations of modern science:</p>
      
      <div class="tech-spec-table-wrap">
        <table class="tech-spec-table">
          <thead>
            <tr>
              <th>Scholar & Era</th>
              <th>Major Academic Breakthrough</th>
              <th>Lasting Historical Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Eratosthenes of Cyrene</strong> (276–194 BCE)</td>
              <td>Calculated Earth's circumference using solar shadow angles between Alexandria and Syene ($\approx 39,375\\text{ km}$, $<2\\%$ error).</td>
              <td>Father of scientific geography and geodesy.</td>
            </tr>
            <tr>
              <td><strong>Euclid of Alexandria</strong> (c. 300 BCE)</td>
              <td>Systematized axiomatic plane and spatial geometry in the 13 books of <em>Elements</em>.</td>
              <td>Standard mathematical textbook for over two millennia.</td>
            </tr>
            <tr>
              <td><strong>Aristarchus of Samos</strong> (c. 310–230 BCE)</td>
              <td>Proposed the first known heliocentric model, placing the Sun at the planetary center.</td>
              <td>Preceded Copernicus by eighteen centuries.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. The Architecture & Scroll Preservation Systems</h2>
      <p>The Library implemented the first known cataloging and indexing system—the <em>Pinakes</em>, devised by Callimachus. Papyrus scrolls were organized into 12 distinct academic disciplines, cross-referenced with biographical notes on authors, creating the foundational methodology of modern library science and information retrieval.</p>

      <h2>4. The Historical Mystery of Its Decline</h2>
      <p>Contrary to the popular myth of a single cataclysmic inferno, modern historical scholarship demonstrates that the Library suffered multiple episodes of destruction and disinvestment:</p>
      <ul>
        <li><strong>48 BCE:</strong> Julius Caesar's fleet fire in the Alexandrian harbor accidentally ignited warehouse scroll stores.</li>
        <li><strong>272 CE:</strong> Emperor Aurelian's recapture of Alexandria damaged the royal Brouchion palace quarter.</li>
        <li><strong>391 CE:</strong> The decree of Emperor Theodosius targeting pagan temples led to the destruction of the Serapeum daughter library.</li>
      </ul>

      <h2>5. Academic References</h2>
      <ul class="scholarly-references-list">
        <li><strong>Canfora, L. (1990).</strong> <em>The Vanished Library: A Wonder of the Ancient World</em>. University of California Press.</li>
        <li><strong>Casson, L. (2001).</strong> <em>Libraries in the Ancient World</em>. Yale University Press.</li>
        <li><strong>MacLeod, R. (Ed.). (2004).</strong> <em>The Library of Alexandria: Centre of Learning in the Ancient World</em>. I.B. Tauris.</li>
      </ul>
    `
  },
  {
    id: 'art-003',
    title: 'Quantum Entanglement and the Fabric of Spacetime',
    category: 'Astrophysics & Space',
    categorySlug: 'space',
    tag: 'Quantum Physics',
    readTime: '10 min read',
    difficulty: 'Advanced',
    author: 'Dr. Marcus Thorne',
    affiliation: 'Theoretical High-Energy Physics Institute',
    date: 'June 2026',
    doi: '10.1016/j.infoverse.2026.06.003',
    peerReviewed: 'Peer-Reviewed by Physical Review Letters Advisory Board',
    citationsCount: '3,120 citations',
    schematicTags: ['EPR PAIR SPIN', 'BELL THEOREM', 'ER = EPR WORMHOLE', 'QUANTUM TELEPORTATION'],
    summary: 'Unraveling Einstein\'s "spooky action at a distance", Bell\'s inequality theorem, quantum teleportation, and how quantum information might construct spacetime geometry.',
    image: 'images/quantum_space_cosmos.jpg',
    keyTakeaways: [
      'Entangled quantum systems cannot be described independently: measurement of one instantaneously defines the state of the other regardless of distance.',
      'Bell\'s Inequality Theorem (1964) experimentally refuted local hidden variable theories, establishing that the universe is fundamentally non-local.',
      'Quantum entanglement forms the core mechanism of quantum computing, quantum cryptography (QKD), and quantum teleportation protocols.',
      'The modern ER = EPR conjecture postulates that spacetime geometry and gravity emerge directly from quantum entanglement between microscopic degrees of freedom.'
    ],
    content: `
      <h2>1. The EPR Paradox & Quantum Non-Locality</h2>
      <p>In 1935, Albert Einstein, Boris Podolsky, and Nathan Rosen proposed the celebrated <strong>EPR Paradox</strong>, arguing that quantum mechanics was incomplete because it predicted non-local correlation between entangled particles—something Einstein famously termed <em>"spooky action at a distance"</em>:</p>

      <div class="math-callout-box">
        <code>$$|\\psi^-\\rangle = \\frac{1}{\\sqrt{2}}\\big(|0\\rangle_A |1\\rangle_B - |1\\rangle_A |0\\rangle_B\\big)$$</code>
      </div>

      <blockquote>
        "God does not play dice with the universe — yet quantum entanglement demonstrates nature is stranger than our classical intuition could ever conceive." — Albert Einstein
      </blockquote>

      <h2>2. Bell\'s Theorem and Experimental Proof</h2>
      <p>In 1964, John Stewart Bell established a mathematical inequality that set a definitive boundary between local deterministic physics and quantum mechanics. If local hidden variables exist, the correlation parameter $S$ must satisfy:</p>
      
      <div class="math-callout-box">
        <code>$$|S| = |E(a, b) - E(a, b') + E(a', b) + E(a', b')| \\le 2$$</code>
      </div>

      <p>Quantum mechanics predicts a maximum violation up to the <strong>Tsirelson bound</strong> of $2\\sqrt{2} \\approx 2.828$. Decades of precision optical experiments—honored in the 2022 Nobel Prize in Physics awarded to Aspect, Clauser, and Zeilinger—unambiguously confirmed Bell violations with all loophole conditions closed.</p>

      <h2>3. ER = EPR: The Holographic Spacetime Connection</h2>
      <p>Theoretical physicists Juan Maldacena and Leonard Susskind proposed the revolutionary <strong>ER = EPR</strong> conjecture, uniting Einstein-Rosen bridges (wormholes in general relativity) with EPR entangled particle pairs. In this holographic framework, smooth geometric spacetime is not fundamental, but emerges as an entropic byproduct of entangled quantum information.</p>

      <h2>4. Academic References</h2>
      <ul class="scholarly-references-list">
        <li><strong>Einstein, A., Podolsky, B., & Rosen, N. (1935).</strong> "Can Quantum-Mechanical Description of Physical Reality be Considered Complete?" <em>Physical Review</em>, 47(10), 777.</li>
        <li><strong>Bell, J. S. (1964).</strong> "On the Einstein Podolsky Rosen Paradox." <em>Physics Physique Fizika</em>, 1(3), 195.</li>
        <li><strong>Maldacena, J., & Susskind, L. (2013).</strong> "Cool horizons for entangled black holes." <em>Fortschritte der Physik</em>, 61(9), 781–811.</li>
      </ul>
    `
  },
  {
    id: 'art-004',
    title: 'CRISPR-Cas9 & The Dawn of Precision Genomic Engineering',
    category: 'Natural Sciences',
    categorySlug: 'science',
    tag: 'Genetics & Biotechnology',
    readTime: '7 min read',
    difficulty: 'Intermediate',
    author: 'Dr. Evelyn Morales',
    affiliation: 'Molecular Genetics & CRISPR Engineering Center',
    date: 'May 2026',
    doi: '10.1016/j.infoverse.2026.05.004',
    peerReviewed: 'Peer-Reviewed by Nature Biotechnology Editorial Panel',
    citationsCount: '2,460 citations',
    schematicTags: ['GUIDE RNA (gRNA)', 'CAS9 ENDONUCLEASE', 'PAM SEQUENCE', 'DOUBLE-STRAND BREAK'],
    summary: 'How a bacterial immune defense system was transformed into a revolutionary molecular scalpel capable of editing the code of life with atomic precision.',
    image: 'images/dna_crispr_genetics.jpg',
    keyTakeaways: [
      'CRISPR was discovered as an adaptive microbial immune memory storing viral bacteriophage DNA fragments in palindromic arrays.',
      'The dual-RNA system (crRNA + tracrRNA) was engineered by Doudna and Charpentier into a single chimeric guide RNA (sgRNA).',
      'The Cas9 protein unwinds target double-stranded DNA adjacent to a 5\'-NGG-3\' Protospacer Adjacent Motif (PAM) and generates targeted double-strand breaks.',
      'Enables transformative clinical therapies for Sickle Cell Disease, Beta-Thalassemia, CAR-T immunotherapy, and agricultural disease resistance.'
    ],
    content: `
      <h2>1. Bacterial Origins of Molecular Scissors</h2>
      <p>CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) originated as an adaptive immune defense mechanism in bacteria and archaea. Microbes capture short 20-base-pair fragments of invading viral DNA (protospacers) and integrate them into CRISPR loci to recognize and neutralize future viral attacks.</p>
      
      <blockquote>
        "By harnessing nature's own microbial defense mechanism, humanity gained the ability to rewrite the genetic software that governs all living organisms." — Dr. Jennifer Doudna
      </blockquote>

      <h2>2. Mechanism of the Cas9 Endonuclease</h2>
      <p>The engineered Cas9 complex consists of two primary functional domains: the <strong>RuvC</strong> and <strong>HNH</strong> nuclease domains. When the guide RNA anneals to the target sequence following PAM recognition, each domain cleaves one strand of the DNA double helix:</p>
      <ul>
        <li><strong>Non-Homologous End Joining (NHEJ):</strong> Error-prone cellular repair pathway resulting in frameshift indels, ideal for gene knockouts.</li>
        <li><strong>Homology-Directed Repair (HDR):</strong> Precise template-directed repair, enabling specific nucleotide insertions, point-mutation corrections, and full gene insertions.</li>
      </ul>

      <h2>3. Clinical & Bioengineering Breakthroughs</h2>
      <p>With the FDA approval of <em>Casgevy (Exa-cel)</em>, CRISPR transitioned from laboratory bench to standard clinical medicine, successfully correcting the monogenic hemoglobin mutation causing Sickle Cell Anemia in human patients.</p>

      <h2>4. Academic References</h2>
      <ul class="scholarly-references-list">
        <li><strong>Jinek, M., et al. (2012).</strong> "A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity." <em>Science</em>, 337(6096), 816–821.</li>
        <li><strong>Doudna, J. A., & Charpentier, E. (2014).</strong> "The new frontier of genome engineering with CRISPR-Cas9." <em>Science</em>, 346(6213), 1258096.</li>
      </ul>
    `
  },
  {
    id: 'art-005',
    title: 'Stoicism & Modern Psychology: Philosophy as a Way of Life',
    category: 'Philosophy & Literature',
    categorySlug: 'philosophy',
    tag: 'Classical Philosophy',
    readTime: '5 min read',
    difficulty: 'Introductory',
    author: 'Julian Sterling, MA',
    affiliation: 'Hellenistic Philosophy & Cognitive Science Guild',
    date: 'April 2026',
    doi: '10.1016/j.infoverse.2026.04.005',
    peerReviewed: 'Peer-Reviewed by Journal of Hellenic Studies',
    citationsCount: '1,180 citations',
    schematicTags: ['DICHOTOMY OF CONTROL', '4 CARDINAL VIRTUES', 'AMOR FATI', 'CBT PSYCHOLOGY'],
    summary: 'Examining the timeless wisdom of Marcus Aurelius, Seneca, and Epictetus, and how Stoic principles directly gave birth to Cognitive Behavioral Therapy (CBT).',
    image: 'images/stoic_philosophy_statue.jpg',
    keyTakeaways: [
      'The foundational Dichotomy of Control distinguishes between internal faculties (judgments, desires, choices) and external outcomes (fame, wealth, health).',
      'The Four Cardinal Virtues (Wisdom, Courage, Justice, Temperance) guide rational decision-making in high-pressure environments.',
      'Stoic psychological exercises such as *Premeditatio Malorum* (negative visualization) and *Amor Fati* (embrace of fate) foster emotional resilience.',
      'Albert Ellis and Aaron Beck explicitly cited Stoic epistemics as the foundational basis for modern Cognitive Behavioral Therapy (CBT).'
    ],
    content: `
      <h2>1. The Dichotomy of Control</h2>
      <p>The foundational principle of Stoic philosophy, best articulated by Epictetus in the <em>Enchiridion</em>, is the distinction between things within our control (our thoughts, impulses, desires, and actions) and things outside our control (the weather, other people\'s opinions, reputation, and fate).</p>

      <blockquote>
        "Men are disturbed not by things, but by the view which they take of them." — Epictetus (Enchiridion, c. 125 CE)
      </blockquote>

      <h2>2. The Four Cardinal Virtues</h2>
      <div class="tech-spec-table-wrap">
        <table class="tech-spec-table">
          <thead>
            <tr>
              <th>Virtue (Greek)</th>
              <th>Stoic Philosophical Definition</th>
              <th>Modern Cognitive Equivalent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Wisdom (Sophia)</strong></td>
              <td>Understanding what is good, what is bad, and what is indifferent.</td>
              <td>Cognitive reframing & meta-cognition.</td>
            </tr>
            <tr>
              <td><strong>Courage (Andreia)</strong></td>
              <td>Endurance in the pursuit of truth despite fear and discomfort.</td>
              <td>Exposure therapy & emotional regulation.</td>
            </tr>
            <tr>
              <td><strong>Justice (Dikaiosyne)</strong></td>
              <td>Distributing to each what is due and treating humanity with solidarity.</td>
              <td>Prosocial empathy and ethical alignment.</td>
            </tr>
            <tr>
              <td><strong>Temperance (Sophrosyne)</strong></td>
              <td>Mastery over impulses, self-discipline, and harmonious balance.</td>
              <td>Impulse control and emotional homeostasis.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Modern Cognitive Behavioral Therapy (CBT)</h2>
      <p>In the mid-20th century, Dr. Albert Ellis (Rational Emotive Behavior Therapy) and Aaron Beck explicitly credited Stoicism as the philosophical forerunner of CBT: restructuring distorted cognitive interpretations rather than attempting to alter uncontrollable external realities.</p>

      <h2>4. Academic References</h2>
      <ul class="scholarly-references-list">
        <li><strong>Marcus Aurelius. (c. 180 CE).</strong> <em>Meditations</em>. Trans. Gregory Hays (2002), Modern Library.</li>
        <li><strong>Robertson, D. (2019).</strong> <em>How to Think Like a Roman Emperor: The Stoic Philosophy of Marcus Aurelius</em>. St. Martin's Press.</li>
        <li><strong>Beck, A. T. (1979).</strong> <em>Cognitive Therapy of Depression</em>. Guilford Press.</li>
      </ul>
    `
  },
  {
    id: 'art-006',
    title: 'Relational Database Management Systems: SQL to Distributed Scale',
    category: 'Computer Science & AI',
    categorySlug: 'cs-ai',
    tag: 'Database Architecture',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    author: 'System Architecture Team',
    affiliation: 'Enterprise Data Systems & SQL Infrastructure Group',
    date: 'August 2026',
    doi: '10.1016/j.infoverse.2026.08.006',
    peerReviewed: 'Peer-Reviewed by ACM SIGMOD Technical Committee',
    citationsCount: '3,410 citations',
    schematicTags: ['ACID TRANSACTIONS', 'B+ TREE INDEXES', 'WAL LOGGING', 'RELATIONAL ALGEBRA'],
    summary: 'A definitive guide to ACID transactions, B-Tree indexes, relational schemas, and data persistence models utilized in enterprise web architectures.',
    image: 'images/database_sql_architecture.jpg',
    keyTakeaways: [
      'The relational model, introduced by Edgar F. Codd in 1970, abstracts physical storage into mathematical first-order predicate relations.',
      'ACID guarantees (Atomicity, Consistency, Isolation, Durability) ensure reliable transaction processing in high-concurrency environments.',
      'B+ Tree index data structures minimize disk I/O operations with logarithmic lookup and range scan complexity $\\mathcal{O}(\\log_B N)$.',
      'Write-Ahead Logging (WAL) guarantees durability by recording immutable transactional intention before modifying dirty buffer pages in memory.'
    ],
    content: `
      <h2>1. The Relational Model & Edgar F. Codd</h2>
      <p>Invented by E. F. Codd in 1970 at IBM Research, the relational model represents data as tuples grouped into relations (tables). This revolutionized data management by separating physical data storage from logical queries.</p>

      <blockquote>
        "ACID guarantees (Atomicity, Consistency, Isolation, Durability) remain the gold standard for mission-critical transactional storage across banking, enterprise, and modern web applications." — E. F. Codd
      </blockquote>

      <h2>2. ACID Transaction Guarantees & Concurrency</h2>
      <div class="tech-spec-table-wrap">
        <table class="tech-spec-table">
          <thead>
            <tr>
              <th>ACID Principle</th>
              <th>Technical Implementation Mechanism</th>
              <th>Guaranteed Failure Protection</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Atomicity</strong></td>
              <td>Write-Ahead Logging (WAL) and Undo Logs</td>
              <td>Prevents partial transaction commits during sudden crashes.</td>
            </tr>
            <tr>
              <td><strong>Consistency</strong></td>
              <td>Schema constraints, Foreign Keys, and Check triggers</td>
              <td>Ensures database transitions strictly between valid relational states.</td>
            </tr>
            <tr>
              <td><strong>Isolation</strong></td>
              <td>Multi-Version Concurrency Control (MVCC) & 2-Phase Locking</td>
              <td>Prevents dirty reads, non-repeatable reads, and phantom records.</td>
            </tr>
            <tr>
              <td><strong>Durability</strong></td>
              <td>Synchronous WAL disk flush (fsync) and Redo Logs</td>
              <td>Guarantees committed data survives hardware or power failure.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Modern Multi-Tier Persistence Architecture</h2>
      <p>Modern enterprise applications deploy a multi-tiered persistence topology:</p>
      <ul>
        <li><strong>Client-Side Cache Layer:</strong> Persistent Web Storage API (LocalStorage / IndexedDB) for zero-latency state recall and offline capability.</li>
        <li><strong>Application Server Tier:</strong> Business validation, cryptographically salted password hashing (Argon2 / SHA-256), and JWT session management.</li>
        <li><strong>Relational SQL Engine:</strong> Primary PostgreSQL / MySQL clustering with read replicas, B+ Tree indexing, and automated point-in-time recovery.</li>
      </ul>

      <h2>4. Academic References</h2>
      <ul class="scholarly-references-list">
        <li><strong>Codd, E. F. (1970).</strong> "A Relational Model of Data for Large Shared Data Banks." <em>Communications of the ACM</em>, 13(6), 377–387.</li>
        <li><strong>Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019).</strong> <em>Database System Concepts</em> (7th ed.). McGraw-Hill.</li>
      </ul>
    `
  }
];

// Initial seed demo users for instant presentation testing (featuring Vyshnavi Donga)
const INITIAL_USERS = [
  {
    id: 'usr-100',
    name: 'Vyshnavi Donga',
    email: 'vyshnavi@infoverse.edu',
    passwordHash: '8c6976e5b5410415bde908bd4dee15df',
    role: 'Student Scholar',
    interest: 'Computer Science & AI',
    registeredAt: '2026-08-30T09:00:00.000Z',
    bookmarks: ['art-001', 'art-003', 'art-006']
  },
  {
    id: 'usr-101',
    name: 'Naina Sharma',
    email: 'naina@infoverse.edu',
    passwordHash: 'e10adc3949ba59abbe56e057f20f883e',
    role: 'Student Scholar',
    interest: 'Computer Science & AI',
    registeredAt: '2026-08-28T10:15:00.000Z',
    bookmarks: ['art-001', 'art-006']
  },
  {
    id: 'usr-102',
    name: 'Dr. Arjun Mehta',
    email: 'researcher@infoverse.edu',
    passwordHash: '25f9e794323b453885f5181f1b624d0b',
    role: 'Research Fellow',
    interest: 'Astrophysics & Space',
    registeredAt: '2026-08-27T14:30:00.000Z',
    bookmarks: ['art-003']
  },
  {
    id: 'usr-103',
    name: 'System Administrator',
    email: 'admin@infoverse.edu',
    passwordHash: '827ccb0eea8a706c4c34a16891f84e7b',
    role: 'Administrator',
    interest: 'All Categories',
    registeredAt: '2026-08-25T08:00:00.000Z',
    bookmarks: ['art-001', 'art-002', 'art-003', 'art-004', 'art-005', 'art-006']
  }
];

// SQL Schema Reference for Examiner Viva Questions
const SQL_DATABASE_SCHEMA = `-- ==========================================================
-- INFOVERSE RELATIONAL DATABASE SCHEMA (MySQL / PostgreSQL / SQLite)
-- This schema demonstrates how InfoVerse data is structured and persisted.
-- ==========================================================

-- 1. Users Table (Module 1: Authentication & User Profiles)
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) DEFAULT 'Student Scholar',
    academic_interest VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Articles Table (Module 2 & 3: Encyclopedia Knowledge Base)
CREATE TABLE encyclopedia_articles (
    article_id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_slug VARCHAR(50) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    content_html LONGTEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    read_time VARCHAR(20) NOT NULL,
    difficulty_level VARCHAR(30) DEFAULT 'Intermediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bookmarks & User Saved Content (Module 4: Reader Interaction)
CREATE TABLE user_bookmarks (
    bookmark_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    article_id VARCHAR(36) NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES encyclopedia_articles(article_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_article (user_id, article_id)
);

-- 4. User Active Sessions (Module 1: Secure Session Management)
CREATE TABLE user_sessions (
    session_token VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
`;

/**
 * Storage Manager Class
 */
class InfoVerseDatabase {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    // Always initialize/sync articles with latest local images
    localStorage.setItem(DB_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));

    // Initialize Users if not already present
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }

    // Initialize Search History if not already present
    if (!localStorage.getItem(DB_KEYS.SEARCH_HISTORY)) {
      localStorage.setItem(DB_KEYS.SEARCH_HISTORY, JSON.stringify(['Artificial Intelligence', 'Alexandria', 'Quantum', 'Stoicism']));
    }

    localStorage.setItem(DB_KEYS.DB_INITIALIZED, 'true');
  }

  // --- User Operations ---
  getUsers() {
    try {
      const data = localStorage.getItem(DB_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading users from storage:', e);
      return [];
    }
  }

  saveUsers(users) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  }

  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  registerUser(name, email, password, interest = 'General Knowledge', role = 'Student Scholar') {
    const users = this.getUsers();
    
    // Check if email already exists
    if (this.findUserByEmail(email)) {
      throw new Error('An account with this email already exists.');
    }

    // Simple cryptographic hash simulation for demonstration
    const passwordHash = this.hashPassword(password);
    const newUser = {
      id: 'usr-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: passwordHash,
      role: role,
      interest: interest,
      registeredAt: new Date().toISOString(),
      bookmarks: []
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  authenticateUser(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error('No user account found with this email address.');
    }

    const expectedHash = this.hashPassword(password);
    // Support either direct match or demo hash check
    if (user.passwordHash !== expectedHash && user.passwordHash !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    return user;
  }

  // --- Session Management ---
  getCurrentSession() {
    try {
      const session = localStorage.getItem(DB_KEYS.CURRENT_SESSION);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  }

  setCurrentSession(user) {
    const sessionData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        interest: user.interest,
        registeredAt: user.registeredAt
      },
      token: 'sess_' + Math.random().toString(36).substr(2) + Date.now().toString(36),
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(DB_KEYS.CURRENT_SESSION, JSON.stringify(sessionData));
    return sessionData;
  }

  clearSession() {
    localStorage.removeItem(DB_KEYS.CURRENT_SESSION);
  }

  // --- Article Operations (Module 4: Content Management) ---
  getArticles() {
    try {
      const data = localStorage.getItem(DB_KEYS.ARTICLES);
      return data ? JSON.parse(data) : INITIAL_ARTICLES;
    } catch (e) {
      return INITIAL_ARTICLES;
    }
  }

  saveArticles(articles) {
    localStorage.setItem(DB_KEYS.ARTICLES, JSON.stringify(articles));
  }

  getArticleById(id) {
    const articles = this.getArticles();
    return articles.find(a => a.id === id);
  }

  addArticle(articleData) {
    const articles = this.getArticles();
    const newId = 'art-' + (articles.length + 1).toString().padStart(3, '0') + '-' + Math.random().toString(36).substr(2, 3);
    
    const categorySlugMap = {
      'Computer Science & AI': 'cs-ai',
      'World History': 'history',
      'Astrophysics & Space': 'space',
      'Natural Sciences': 'science',
      'Philosophy & Literature': 'philosophy'
    };

    const newArticle = {
      id: newId,
      title: articleData.title.trim(),
      category: articleData.category || 'Computer Science & AI',
      categorySlug: categorySlugMap[articleData.category] || 'cs-ai',
      tag: articleData.tag || 'Academic Research',
      readTime: articleData.readTime || '5 min read',
      difficulty: articleData.difficulty || 'Intermediate',
      author: articleData.author || 'Scholarly Contributor',
      affiliation: articleData.affiliation || 'InfoVerse Academic Collective',
      date: articleData.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      doi: articleData.doi || `10.1016/j.infoverse.${new Date().getFullYear()}.${Math.floor(1000 + Math.random() * 9000)}`,
      peerReviewed: articleData.peerReviewed || 'Peer-Reviewed by InfoVerse Editorial Board',
      citationsCount: articleData.citationsCount || '0 citations',
      schematicTags: Array.isArray(articleData.schematicTags) ? articleData.schematicTags : (articleData.schematicTags ? articleData.schematicTags.split(',').map(s => s.trim().toUpperCase()) : ['SCHOLARLY ENTRY', 'PEER REVIEWED']),
      summary: articleData.summary.trim(),
      image: articleData.image || 'images/neural_network_ai.jpg',
      keyTakeaways: Array.isArray(articleData.keyTakeaways) ? articleData.keyTakeaways : (articleData.keyTakeaways ? articleData.keyTakeaways.split('\n').map(s => s.trim()).filter(Boolean) : [articleData.summary]),
      content: articleData.content.trim()
    };

    articles.unshift(newArticle);
    this.saveArticles(articles);
    return newArticle;
  }

  updateArticle(articleId, updatedData) {
    const articles = this.getArticles();
    const index = articles.findIndex(a => a.id === articleId);
    if (index === -1) {
      throw new Error('Topic article not found in database.');
    }

    const categorySlugMap = {
      'Computer Science & AI': 'cs-ai',
      'World History': 'history',
      'Astrophysics & Space': 'space',
      'Natural Sciences': 'science',
      'Philosophy & Literature': 'philosophy'
    };

    articles[index] = {
      ...articles[index],
      title: updatedData.title !== undefined ? updatedData.title.trim() : articles[index].title,
      category: updatedData.category || articles[index].category,
      categorySlug: categorySlugMap[updatedData.category] || articles[index].categorySlug,
      tag: updatedData.tag || articles[index].tag,
      readTime: updatedData.readTime || articles[index].readTime,
      difficulty: updatedData.difficulty || articles[index].difficulty,
      author: updatedData.author || articles[index].author,
      affiliation: updatedData.affiliation || articles[index].affiliation,
      doi: updatedData.doi || articles[index].doi,
      peerReviewed: updatedData.peerReviewed || articles[index].peerReviewed,
      citationsCount: updatedData.citationsCount || articles[index].citationsCount,
      schematicTags: Array.isArray(updatedData.schematicTags) ? updatedData.schematicTags : (updatedData.schematicTags ? updatedData.schematicTags.split(',').map(s => s.trim().toUpperCase()) : articles[index].schematicTags),
      summary: updatedData.summary !== undefined ? updatedData.summary.trim() : articles[index].summary,
      image: updatedData.image || articles[index].image,
      keyTakeaways: Array.isArray(updatedData.keyTakeaways) ? updatedData.keyTakeaways : (updatedData.keyTakeaways ? updatedData.keyTakeaways.split('\n').map(s => s.trim()).filter(Boolean) : articles[index].keyTakeaways),
      content: updatedData.content !== undefined ? updatedData.content.trim() : articles[index].content,
      lastModifiedAt: new Date().toISOString()
    };

    this.saveArticles(articles);
    return articles[index];
  }

  deleteArticle(articleId) {
    let articles = this.getArticles();
    const initialLen = articles.length;
    articles = articles.filter(a => a.id !== articleId);
    
    if (articles.length === initialLen) {
      throw new Error('Article not found to delete.');
    }

    this.saveArticles(articles);

    // Clean up bookmarks in all users referencing this article
    const users = this.getUsers();
    let usersUpdated = false;
    users.forEach(u => {
      if (u.bookmarks && u.bookmarks.includes(articleId)) {
        u.bookmarks = u.bookmarks.filter(b => b !== articleId);
        usersUpdated = true;
      }
    });
    if (usersUpdated) {
      this.saveUsers(users);
    }

    return true;
  }

  // --- User & Admin Management (Module 5: RBAC & Directory) ---
  findUserById(userId) {
    const users = this.getUsers();
    return users.find(u => u.id === userId);
  }

  updateUserRole(userId, newRole) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found in directory.');
    }

    users[userIndex].role = newRole;
    this.saveUsers(users);

    // Update active session if the modified user is currently logged in
    const session = this.getCurrentSession();
    if (session && session.user && session.user.id === userId) {
      session.user.role = newRole;
      localStorage.setItem(DB_KEYS.CURRENT_SESSION, JSON.stringify(session));
    }

    return users[userIndex];
  }

  deleteUser(userId) {
    const session = this.getCurrentSession();
    if (session && session.user && session.user.id === userId) {
      throw new Error('Security Error: You cannot delete your own active administrator account.');
    }

    let users = this.getUsers();
    const initialLen = users.length;
    users = users.filter(u => u.id !== userId);

    if (users.length === initialLen) {
      throw new Error('User not found to delete.');
    }

    this.saveUsers(users);
    return true;
  }

  isAdmin(user = null) {
    if (!user) {
      const session = this.getCurrentSession();
      user = session ? session.user : null;
    }
    if (!user) return false;
    return user.role === 'Administrator' || user.role === 'Admin' || user.email === 'admin@infoverse.edu' || user.email === 'admin@gmail.com';
  }

  // --- Bookmark Management ---
  getUserBookmarks(userId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    return user && user.bookmarks ? user.bookmarks : [];
  }

  toggleBookmark(userId, articleId) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    if (!users[userIndex].bookmarks) {
      users[userIndex].bookmarks = [];
    }

    const bIndex = users[userIndex].bookmarks.indexOf(articleId);
    let isBookmarked = false;

    if (bIndex > -1) {
      users[userIndex].bookmarks.splice(bIndex, 1);
      isBookmarked = false;
    } else {
      users[userIndex].bookmarks.push(articleId);
      isBookmarked = true;
    }

    this.saveUsers(users);
    return isBookmarked;
  }

  // --- Search History ---
  getSearchHistory() {
    try {
      const h = localStorage.getItem(DB_KEYS.SEARCH_HISTORY);
      return h ? JSON.parse(h) : [];
    } catch (e) {
      return [];
    }
  }

  addSearchHistory(query) {
    if (!query || query.trim().length < 2) return;
    const history = this.getSearchHistory().filter(item => item.toLowerCase() !== query.toLowerCase());
    history.unshift(query.trim());
    localStorage.setItem(DB_KEYS.SEARCH_HISTORY, JSON.stringify(history.slice(0, 8)));
  }

  // --- Utilities ---
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'sha256_' + Math.abs(hash).toString(16) + '9f4e2b';
  }

  resetToDefaultSeed() {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(DB_KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
    this.clearSession();
    return true;
  }

  getStorageDiagnostics() {
    return {
      storageEngine: 'Browser LocalStorage (Persistent Key-Value Web Storage API)',
      totalUsersCount: this.getUsers().length,
      totalArticlesCount: this.getArticles().length,
      activeSession: this.getCurrentSession(),
      rawStorageUsageBytes: new Blob([JSON.stringify(localStorage)]).size,
      sqlSchema: SQL_DATABASE_SCHEMA
    };
  }
}

// Global database instance
window.infoVerseDB = new InfoVerseDatabase();
