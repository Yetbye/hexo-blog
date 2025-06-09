---
title: 简易情感分析（星级）应用搭建
cover: /image/postcover/realW_2.jpg
slug: RealW_2
categories:
  - nlp
---



*例会讲义，摘自《Real-World Natural Language Processing: Practical applications with deep learning》*

（核心工作都交由第三库实现）


# 情感分析简介

定义：基于文本数据得到评价指标：褒贬（好或坏，喜欢或讨厌），基本任务是对其极性进行分类

难点分析：对于评语往往是非结构化的，且由于语法的特殊，导致不易判断，比如双重否定，讽刺修辞。
例： `"The movie was neither funny nor witty."` 表面含正向词但整体为负面。


极性分类是句子分类的一种，同样的还有垃圾邮件过滤。


基于基础的监督学习，那么对应的数据集会是什么样，会是像手写数字集那样一个句子对应一个label吗
# NLP的数据集


NLP的数据集又称为语料库（corpus），除了基础的（上面所说的），流行的语料库往往具有更加复杂的结构。

比如，一个数据集可能包含一组句子，其中每个句子都包含了详细的语言心思解释，如词性标注，句法解析树，依赖结构和语义角色。其中包含语法解析树的数据集成为树库。

实例的概念：预测的基本单位。可以简单理解为任务真实处理的对象。

#### 斯坦福情感树库（SST）

目前使用最广泛的情感分析数据集，此次应用将基于它。关于其结构可自行了解。（每一个单词，短语，句子都有情感标签（5级：`1`强负→`5`强正））


#### 训练集、验证集和测试集

在此不再赘述


#### 使用AllenNLP 加载SST 数据集

###### 环境及需求

关键库：
```bash
pip install allennlp
piip instal allennlp-models
```

导入必要类与模块：
```python
from itertools import chain
from typing import Dict
import numpy as np
import torch
import torch.optim as optim
from allennlp.data.data_loaders import MultiProcessDataLoader
from allennlp.data.samplers import BucketBatchSampler
from allennlp.data.vocabulary import Vocabulary
from allennlp.models import Model
from allennlp.modules.seq2vec_encoders import Seq2VecEncoder, PytorchSeq2VecWrapper
from allennlp.modules.text_field_embedders import TextFieldEmbedder,
BasicTextFieldEmbedder
from allennlp.modules.token_embedders import Embedding
from allennlp.nn.util import get_text_field_mask
from allennlp.training import GradientDescentTrainer
from allennlp.training.metrics import CategoricalAccuracy, F1Measure
from allennlp_models.classification.dataset_readers.stanford_sentiment_tree_bank import StanfordSentimentTreeBankDatasetReader
```

定义两个必要常量 ：

`EMBEDDING_DIM = 128   # 词向量维度`      
`HIDDEN_DIM = 128   # 隐藏维度`


`StanfordSentimentTreeBankDatasetReader()` 是 专门用于读取SST数据集的方法（一般的DatasetReader读取原始文本以实例集合的格式返回）

```python
reader = StanfordSentimentTreeBankDatasetReader()
train_path = 'https:/./s3.amazonaws.com/realworldnlpbook/data/stanfordSentimentTreebank/trees/train.txt'
dev_path = 'https:/./s3.amazonaws.com/realworldnlpbook/data/stanfordSentimentTreebank/trees/dev.txt'
# 可自行定义本地文件路径
```



# 深度学习的应用及词嵌入

此前例会已经提到深度神经网络有能力拟合任何函数，也就是可以从任一向量出发，得到你想要的向量。（或许说的不严谨）

对于NLP任务而言，一切文本数据都是离散的，形式和意义之间没有可预测的关系（比如rat和sat）

### 词嵌入（简单介绍，深入了解可看后续笔记）

词嵌入的目的就是将离散的文本数据转化为向量，且具有空间关联性（意义是连续的）

对于此前的one - hot vector， 虽然可以将单词转化为向量，但是丧失了单词之间的语义关系，以范数或距离而言，两两词向量的距离都是相等的。

举例：…………

一维到高维，如果将每个维度视为视作一个属性，便能将单词嵌入到高维空间。
![](/image/postcover/一维.png)
![](/image/postcover/二维.png)
![](/image/postcover/三维.png)


### RNN & FCL


##### RNN

循环神经网络是一个具有循环结构的神经网络，类似于for循环，可以处理句子中的每一个单词。最终输出值可以将句子转换为具有固定大小的向量（类似于词嵌入的功能）
![](/image/postcover/RNN.png)

##### FCL (全连接层)

就如CV部分提到的那样，FCL的作用就是可以映射线性空间，实现高低维度的转换。


##### 搭建网络架构

创建RNN中的一类网络：LSTM
```python
encoder = PytorchSeq2VecWrapper(
    torch.nn.LSTM(EMBEDDING_DIM, HIDDEN_DIM, batch_first=True))

```


创建一个线性层
```python
self.linear = torch.nn.Linear(in_features=encoder.get_output_dim(),out_features=vocab.get_vocab_size('labels'))

```
> 这里的输出向量的维度是标签的总数


```python
class LstmClassifier(Model):
    def __init__(self,
	            word_embeddings: TextFieldEmbedder,
                 encoder: Seq2VecEncoder,
                 vocab: Vocabulary,
                 positive_label: str = '4') -> None:
        super().__init__(vocab)
        self.word_embeddings = word_embeddings
 
        self.encoder = encoder
 
        self.linear = torch.nn.Linear(in_features=encoder.get_output_dim(),
                                      out_features=vocab.get_vocab_size('labels'))
 
        self.loss_function = torch.nn.CrossEntropyLoss()         
 
    def forward(self,                                            
                tokens: Dict[str, torch.Tensor],
                label: torch.Tensor = None) -> torch.Tensor:
        mask = get_text_field_mask(tokens)
 
        embeddings = self.word_embeddings(tokens)
        encoder_out = self.encoder(embeddings, mask)
        logits = self.linear(encoder_out)
 
        output = {"logits": logits}
        if label is not None:
            self.accuracy(logits, label)
            self.f1_measure(logits, label)
            output["loss"] = self.loss_function(logits, label)   
        return output

		
```

logit :可以理解为某个分类标签的得分（概率）




# 动手训练及评估

批量处理
```python
sampler = BucketBatchSampler(batch_size=32, sorting_keys=["tokens"])
train_data_loader = MultiProcessDataLoader(reader, train_path, batch_sampler=sampler)
dev_data_loader = MultiProcessDataLoader(reader, dev_path, batch_sampler=sampler)

```

batch_size指定每个批量的实例数

组合
```python
model = LstmClassifier(word_embeddings, encoder, vocab)
optimizer = optim.Adam(model.parameters())

# 这里使用AllenNLP的Trainer类作为一个框架将所有组件组合起来
trainer = GradientDescentTrainer(
    model=model,
    optimizer=optimizer,
    data_loader=train_data_loader,
    validation_data_loader=dev_data_loader,
    patience=10,
    num_epochs=20,
    cuda_device=-1)  # 指定CPU训练
 
trainer.train()

```


使用AllenNPLP进行监控和评估，借助于get_metrics()方法，其返回一些指标名称及其值。

```python
def get_metrics(self, reset: bool = False) -> Dict[str, float]:
        return {'accuracy': self.accuracy.get_metric(reset),
                **self.f1_measure.get_metric(reset)}
                
self.accuracy = CategoricalAccuracy()
self.f1_measure = F1Measure(positive_index)

```




# 本地部署


### 本地预测

作者专门为该任务编写了一个预测器：`SentenceClassifierPredictor`, 直接输入原始字符串即可,以下为作者仓库源码
```python

# fliename:  realworldnlp.predictors.py

from allennlp.common import JsonDict
from allennlp.data import DatasetReader, Instance
from allennlp.data.tokenizers.spacy_tokenizer import SpacyTokenizer
from allennlp.models import Model
from allennlp.predictors import Predictor
from overrides import overrides
from typing import List


# You need to name your predictor and register so that `allennlp` command can recognize it
# Note that you need to use "@Predictor.register", not "@Model.register"!
@Predictor.register("sentence_classifier_predictor")
class SentenceClassifierPredictor(Predictor):
    def __init__(self, model: Model, dataset_reader: DatasetReader) -> None:
        super().__init__(model, dataset_reader)
        self._tokenizer = dataset_reader._tokenizer or SpacyTokenizer()

    def predict(self, sentence: str) -> JsonDict:
        return self.predict_json({"sentence" : sentence})

    @overrides
    def _json_to_instance(self, json_dict: JsonDict) -> Instance:
        sentence = json_dict["sentence"]
        tokens = self._tokenizer.tokenize(sentence)
        return self._dataset_reader.text_to_instance([str(t) for t in tokens])


@Predictor.register("universal_pos_predictor")
class UniversalPOSPredictor(Predictor):
    def __init__(self, model: Model, dataset_reader: DatasetReader) -> None:
        super().__init__(model, dataset_reader)

    def predict(self, words: List[str]) -> JsonDict:
        return self.predict_json({"words" : words})

    @overrides
    def _json_to_instance(self, json_dict: JsonDict) -> Instance:
        words = json_dict["words"]
        # This is a hack - the second argument to text_to_instance is a list of POS tags
        # that has the same length as words. We don't need it for prediction so
        # just pass words.
        return self._dataset_reader.text_to_instance(words, words)
```

我们在该任务中只需导入并调用

```python
from realworldnlp.predictors import SentenceClassifierPredictor

predictor = SentenceClassifierPredictor(model, dataset_reader=reader)
logits = predictor.predict('This is the best movie ever!')['logits']  # 任意例句

label_id = np.argmax(logits)
print(model.vocab.get_token_from_index(label_id, 'labels'))  # 输出4，对应强积极

```



### 部署本地web端

*原书是基于Linus系统的， 我们这里需要改为Windows系统*

#### 将训练好的model保存到本地

在代码最后部分添加保存代码，转换为本地tar.gz文件

```python
# 在训练代码末尾添加模型保存逻辑
from allennlp.models.archival import archive_model (依赖项)

# 指定模型保存路径（Windows路径格式）
model_dir = "C:\\nlp_models\\sentiment_analyzer"
vocab_dir = os.path.join(model_dir, "vocabulary")

# 确保目录存在
os.makedirs(vocab_dir, exist_ok=True)

# 保存词汇表（关键！）
vocab.save_to_files(vocab_dir)

# 打包完整模型
archive_model(
    archive_path=os.path.join(model_dir, "model.tar.gz"),
    weights=model.state_dict(),
    config={"model": {"type": "lstm_classifier"}},  # 您的模型类型
    vocab_path=vocab_dir
)
```


#### 使用 Flask 创建 Web API

安装依赖项
```bash
pip install flask spacy
python -m spacy download en_core_web_sm # 安装AllenNLP默认使用的tokenizer
```

创建文件app.py
```python
from flask import Flask, request, jsonify
from allennlp.models.archival import load_archive
from allennlp.predictors import Predictor
from allennlp.data.tokenizers import SpacyTokenizer
import torch

app = Flask(__name__)

# 自定义预测器（适配SST格式）
class SSTPredictor(Predictor):
    def predict(self, sentence: str) -> dict:
        # 使用与训练相同的tokenizer
        tokenizer = SpacyTokenizer()
        tokens = tokenizer.tokenize(sentence)
        instance = self._dataset_reader.text_to_instance(tokens)
        return self.predict_instance(instance)

# 加载模型（Windows路径）
model_path = "C:\\nlp_models\\sentiment_analyzer\\model.tar.gz"
archive = load_archive(model_path)
predictor = SSTPredictor.from_archive(archive)

@app.route('/predict', methods=['POST'])
def analyze_sentiment():
    data = request.json
    sentence = data.get("sentence", "")
    
    if not sentence:
        return jsonify(error="Missing 'sentence' parameter"), 400
    
    try:
        # 移出GPU（如果在Windows CPU上运行）
        predictor._model = predictor._model.cpu()
        
        # 执行预测
        result = predictor.predict(sentence)
        logits = result["logits"]
        label_id = logits.argmax()
        label = predictor._model.vocab.get_token_from_index(label_id, "labels")
        
        return jsonify({
            "sentence": sentence,
            "sentiment": label,
            "confidence": float(torch.nn.functional.softmax(torch.tensor(logits), dim=0)[label_id])
        })
    
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
```

终端运行   `python app.py`
即可在本地浏览器访问localhost：8000 获取预测服务


当然你还可以在app.py中自行添加一些HTML代码，以优化界面



# 附完整训练代码

摘自相应仓库

```python
from itertools import chain
from typing import Dict

import numpy as np
import torch
import torch.optim as optim
from allennlp.data import TextFieldTensors
from allennlp.data.data_loaders import MultiProcessDataLoader
from allennlp.data.samplers import BucketBatchSampler
from allennlp.data.vocabulary import Vocabulary
from allennlp.models import Model
from allennlp.modules.seq2vec_encoders import Seq2VecEncoder, PytorchSeq2VecWrapper
from allennlp.modules.text_field_embedders import TextFieldEmbedder, BasicTextFieldEmbedder
from allennlp.modules.token_embedders import Embedding
from allennlp.nn.util import get_text_field_mask
from allennlp.training.metrics import CategoricalAccuracy, F1Measure
from allennlp.training import GradientDescentTrainer
from allennlp_models.classification.dataset_readers.stanford_sentiment_tree_bank import \
    StanfordSentimentTreeBankDatasetReader

from realworldnlp.predictors import SentenceClassifierPredictor

EMBEDDING_DIM = 128
HIDDEN_DIM = 128


# Model in AllenNLP represents a model that is trained.
@Model.register("lstm_classifier")
class LstmClassifier(Model):
    def __init__(self,
                 embedder: TextFieldEmbedder,
                 encoder: Seq2VecEncoder,
                 vocab: Vocabulary,
                 positive_label: str = '4') -> None:
        super().__init__(vocab)
        # We need the embeddings to convert word IDs to their vector representations
        self.embedder = embedder

        self.encoder = encoder

        # After converting a sequence of vectors to a single vector, we feed it into
        # a fully-connected linear layer to reduce the dimension to the total number of labels.
        self.linear = torch.nn.Linear(in_features=encoder.get_output_dim(),
                                      out_features=vocab.get_vocab_size('labels'))

        # Monitor the metrics - we use accuracy, as well as prec, rec, f1 for 4 (very positive)
        positive_index = vocab.get_token_index(positive_label, namespace='labels')
        self.accuracy = CategoricalAccuracy()
        self.f1_measure = F1Measure(positive_index)

        # We use the cross entropy loss because this is a classification task.
        # Note that PyTorch's CrossEntropyLoss combines softmax and log likelihood loss,
        # which makes it unnecessary to add a separate softmax layer.
        self.loss_function = torch.nn.CrossEntropyLoss()

    # Instances are fed to forward after batching.
    # Fields are passed through arguments with the same name.
    def forward(self,
                tokens: TextFieldTensors,
                label: torch.Tensor = None) -> torch.Tensor:
        # In deep NLP, when sequences of tensors in different lengths are batched together,
        # shorter sequences get padded with zeros to make them equal length.
        # Masking is the process to ignore extra zeros added by padding
        mask = get_text_field_mask(tokens)

        # Forward pass
        embeddings = self.embedder(tokens)
        encoder_out = self.encoder(embeddings, mask)
        logits = self.linear(encoder_out)

        probs = torch.softmax(logits, dim=-1)
        # In AllenNLP, the output of forward() is a dictionary.
        # Your output dictionary must contain a "loss" key for your model to be trained.
        output = {"logits": logits, "cls_emb": encoder_out, "probs": probs}
        if label is not None:
            self.accuracy(logits, label)
            self.f1_measure(logits, label)
            output["loss"] = self.loss_function(logits, label)

        return output

    def get_metrics(self, reset: bool = False) -> Dict[str, float]:
        return {'accuracy': self.accuracy.get_metric(reset),
                **self.f1_measure.get_metric(reset)}

def main():
    reader = StanfordSentimentTreeBankDatasetReader()
    train_path = 'https://s3.amazonaws.com/realworldnlpbook/data/stanfordSentimentTreebank/trees/train.txt'
    dev_path = 'https://s3.amazonaws.com/realworldnlpbook/data/stanfordSentimentTreebank/trees/dev.txt'

    sampler = BucketBatchSampler(batch_size=32, sorting_keys=["tokens"])
    train_data_loader = MultiProcessDataLoader(reader, train_path, batch_sampler=sampler)
    dev_data_loader = MultiProcessDataLoader(reader, dev_path, batch_sampler=sampler)

    # You can optionally specify the minimum count of tokens/labels.
    # `min_count={'tokens':3}` here means that any tokens that appear less than three times
    # will be ignored and not included in the vocabulary.
    vocab = Vocabulary.from_instances(chain(train_data_loader.iter_instances(), dev_data_loader.iter_instances()),
                                      min_count={'tokens': 3})
    train_data_loader.index_with(vocab)
    dev_data_loader.index_with(vocab)

    token_embedding = Embedding(num_embeddings=vocab.get_vocab_size('tokens'),
                                embedding_dim=EMBEDDING_DIM)

    # BasicTextFieldEmbedder takes a dict - we need an embedding just for tokens,
    # not for labels, which are used as-is as the "answer" of the sentence classification
    word_embeddings = BasicTextFieldEmbedder({"tokens": token_embedding})

    # Seq2VecEncoder is a neural network abstraction that takes a sequence of something
    # (usually a sequence of embedded word vectors), processes it, and returns a single
    # vector. Oftentimes this is an RNN-based architecture (e.g., LSTM or GRU), but
    # AllenNLP also supports CNNs and other simple architectures (for example,
    # just averaging over the input vectors).
    encoder = PytorchSeq2VecWrapper(
        torch.nn.LSTM(EMBEDDING_DIM, HIDDEN_DIM, batch_first=True))

    model = LstmClassifier(word_embeddings, encoder, vocab)

    optimizer = optim.Adam(model.parameters(), lr=1e-4, weight_decay=1e-5)

    trainer = GradientDescentTrainer(
        model=model,
        optimizer=optimizer,
        data_loader=train_data_loader,
        validation_data_loader=dev_data_loader,
        patience=10,
        num_epochs=20,
        cuda_device=-1)

    trainer.train()

    predictor = SentenceClassifierPredictor(model, dataset_reader=reader)
    logits = predictor.predict('This is the best movie ever!')['logits']
    label_id = np.argmax(logits)

    print(model.vocab.get_token_from_index(label_id, 'labels'))


if __name__ == '__main__':
    main()
```
