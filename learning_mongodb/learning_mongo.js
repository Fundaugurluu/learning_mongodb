const express = require('express');
const bodyParser = require('body-parser');
const AramaAgaci = require('./AramaAgaci'); 
const PORT = 3001;
const tree = new AramaAgaci();
const app = express();
const mongoose = require('mongoose');
app.use(bodyParser.json());

const dbURL = 'mongodb+srv://fundauggurlu:funda@cluster0.ohggs1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';



mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })

    .then((result) => {
        console.log('Baglantı kuruldu');
        app.listen(PORT, () => {
            console.log(`Server ${PORT} portunda çalışıyor`);
        });
    })
    .catch((err) => console.log(err));


    const { Schema } = mongoose;

    const nodeSchema = new Schema({
        value: { type: Number, required: true }
    });
    
    const Node = mongoose.model('Node', nodeSchema);
    

app.post('/nodes', async (req, res) => {
   
  const value = req.body.value;
    try  {
        const newNode = new Node({ value });
        await newNode.save();
        res.send(`Düğüm ${value} eklendi.`);
    } catch (err) {
         console.error('dugum ekleme hatasi:', err);
        res.status(500).send('dugum eklenirken hata olustu');
    }
});

app.get('/nodes/search/:value', async (req, res) => 
    
 {
    const value = parseInt(req.params.value, 10);
    try {
        const node = await Node.findOne({ value });
        if (node) {
            res.send(node);
        } else 
        {
             res.status(404).send('dugum bulunamadı.');
        }
    } catch (err) 
    {
         console.error('dugum arama hatası:', err);
        res.status(500).send('dugum aranirken hata olustu');
    }

});


app.put('/nodes/:id', async (req, res) => 
    {
    const id = req.params.id;
    const newValue = req.body.value;
    try {
        const updatedNode = await Node.findByIdAndUpdate(id, { value: newValue }, { new: true });
        if (updatedNode) {
            res.send(`dugum ${id} güncellendi ve yeni değer ${newValue} oldu.`);
        } else {
            res.status(404).send(`Düğüm ${id} bulunamadı.`);
        }
    } catch (err) {
        console.error('dugum guncelleme hatası:', err);
        res.status(500).send('dugum guncellenirken hata olustu');
    }
});


app.delete('/nodes/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedNode = await Node.findByIdAndDelete(id);
        if (deletedNode) 
         {
            res.send(`dugum ${id} silindi.`);
        } else {
            res.status(404).send(`dugum ${id} bulunamadı.`);
        }
    } catch (err)
     {
        console.error('dugum silme hatası:', err);
        res.status(500).send('dugum silinirken hata olustu');
    }
});
