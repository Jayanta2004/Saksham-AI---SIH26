import os
import math
import re
import json
from typing import List, Dict, Any, Optional
import numpy as np

class InMemoryVectorStore:
    """
    High-performance Vector Store and Semantic Search Index for Official Statistical Documents.
    Supports OpenAI Embedding API integration with a robust deterministic TF-IDF / Sub-word
    Semantic Cosine Embedder fallback.
    """

    def __init__(self, collection_name: str = "default_mospi_docs"):
        self.collection_name = collection_name
        self.chunks: List[Dict[str, Any]] = []
        self.embeddings: Optional[np.ndarray] = None
        self.vocab: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}

    def add_chunks(self, chunks: List[Dict[str, Any]], openai_api_key: Optional[str] = None):
        """
        Embed and store document chunks in the index.
        """
        if not chunks:
            return

        self.chunks.extend(chunks)
        
        # Try OpenAI embeddings if key is provided
        api_key = openai_api_key or os.getenv("OPENAI_API_KEY")
        if api_key:
            try:
                import openai
                client = openai.OpenAI(api_key=api_key)
                texts = [c["text"] for c in self.chunks]
                # Batch in groups of 50
                batch_embeddings = []
                for i in range(0, len(texts), 50):
                    batch = texts[i:i+50]
                    res = client.embeddings.create(
                        input=batch,
                        model="text-embedding-3-small"
                    )
                    batch_embeddings.extend([item.embedding for item in res.data])
                self.embeddings = np.array(batch_embeddings, dtype=np.float32)
                return
            except Exception as e:
                print(f"[VectorStore] OpenAI embedding API unavailable ({e}), using statistical semantic embedder fallback.")

        # Statistical Semantic Vector Embedding Fallback
        self._build_semantic_embeddings()

    def _tokenize(self, text: str) -> List[str]:
        tokens = re.findall(r'\b[a-zA-Z0-9_\-\$]{2,}\b', text.lower())
        return tokens

    def _build_semantic_embeddings(self):
        doc_count = len(self.chunks)
        if doc_count == 0:
            return

        # Build vocabulary & document frequency
        df: Dict[str, int] = {}
        tokenized_docs = []
        for chunk in self.chunks:
            tokens = set(self._tokenize(chunk["text"]))
            tokenized_docs.append(tokens)
            for t in tokens:
                df[t] = df.get(t, 0) + 1

        # Select top vocabulary
        sorted_vocab = sorted(df.items(), key=lambda x: x[1], reverse=True)[:4000]
        self.vocab = {word: idx for idx, (word, _) in enumerate(sorted_vocab)}
        self.idf = {word: math.log((1 + doc_count) / (1 + count)) + 1.0 for word, count in sorted_vocab}

        dim = len(self.vocab)
        emb_matrix = np.zeros((doc_count, dim), dtype=np.float32)

        for i, chunk in enumerate(self.chunks):
            tokens = self._tokenize(chunk["text"])
            for t in tokens:
                if t in self.vocab:
                    col = self.vocab[t]
                    emb_matrix[i, col] += self.idf[t]

            # L2 normalize
            norm = np.linalg.norm(emb_matrix[i])
            if norm > 0:
                emb_matrix[i] = emb_matrix[i] / norm

        self.embeddings = emb_matrix

    def query(self, query_text: str, top_k: int = 4, openai_api_key: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Retrieve top-k most semantically relevant chunks for a prompt or query.
        """
        if not self.chunks or self.embeddings is None:
            return []

        api_key = openai_api_key or os.getenv("OPENAI_API_KEY")
        if api_key and self.embeddings.shape[1] == 1536: # OpenAI 3-small dimensions
            try:
                import openai
                client = openai.OpenAI(api_key=api_key)
                res = client.embeddings.create(input=[query_text], model="text-embedding-3-small")
                q_vec = np.array(res.data[0].embedding, dtype=np.float32)
                # Cosine similarity
                scores = np.dot(self.embeddings, q_vec)
                top_indices = np.argsort(scores)[::-1][:top_k]
                results = []
                for idx in top_indices:
                    item = dict(self.chunks[idx])
                    item["similarity_score"] = float(scores[idx])
                    results.append(item)
                return results
            except Exception as e:
                print(f"[VectorStore] Query embedding error: {e}")

        # Fallback Query Vector
        if not self.vocab or self.embeddings is None:
            return self.chunks[:top_k]

        q_vec = np.zeros(len(self.vocab), dtype=np.float32)
        q_tokens = self._tokenize(query_text)
        for t in q_tokens:
            if t in self.vocab:
                col = self.vocab[t]
                q_vec[col] += self.idf.get(t, 1.0)

        q_norm = np.linalg.norm(q_vec)
        if q_norm > 0:
            q_vec = q_vec / q_norm

        scores = np.dot(self.embeddings, q_vec)
        top_indices = np.argsort(scores)[::-1][:top_k]

        results = []
        for idx in top_indices:
            item = dict(self.chunks[idx])
            item["similarity_score"] = float(scores[idx])
            results.append(item)

        return results

# Global registry of document vector collections
vector_collections: Dict[str, InMemoryVectorStore] = {}

def get_or_create_collection(name: str) -> InMemoryVectorStore:
    if name not in vector_collections:
        vector_collections[name] = InMemoryVectorStore(collection_name=name)
    return vector_collections[name]
