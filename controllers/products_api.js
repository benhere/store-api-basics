const Product = require('../models/productsModel');

const getAllProductsStatic = async (req,res) => {
    // throw new Error('testing async errors')
    const products = await Product.find({price:{ $gt:30 }}).sort('price').select("name price");
    res.status(200).json({products, count:products.length })
}

const getAllProducts = async (req,res) => {
    // console.log(req.query);
    const{ featured,company, name, sort, fields, numericFilters } = req.query;
    const queryObj = {};
    
    if(numericFilters){
        console.log(numericFilters);
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );
        //console.log(filters);

        const options = ["price", "rating"];
        filters = filters.split(",").forEach((item) => {
          const [field, operator, value] = item.split("-");
          if (options.includes(field)) {
            queryObj[field] = { [operator]: Number(value) };
          }
        });
    }

    console.log(queryObj);
    if(featured){
        queryObj.featured = featured === 'true' ? true : false
    }

    if(company){
        queryObj.company = company
    }

    if(name){
        queryObj.name = { $regex:name, $options:'i' }
    }

    let result = Product.find(queryObj)
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList);
    }else{
        result = result.sort('createdAt');
    }

    if(fields){
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1) * limit;
    
    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({products, count:products.length})
}

module.exports = {
    getAllProducts, getAllProductsStatic
}
